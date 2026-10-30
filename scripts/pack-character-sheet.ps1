param([Parameter(Mandatory=$true)][string]$SourceImage, [string]$WalkSourceImage, [string]$Destination, [switch]$MeasureOnly)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$drawingReferences=[System.AppDomain]::CurrentDomain.GetAssemblies() | Where-Object { $_.GetName().Name -match 'Drawing|^System.Private|^System.Collections$|^System.Runtime$' } | Select-Object -ExpandProperty Location
Add-Type -ReferencedAssemblies $drawingReferences -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
public class CharacterPart {
 public int X0,Y0,X1,Y1,Area;
 public double CenterX {get{return (X0+X1)/2.0;}}
 public double CenterY {get{return (Y0+Y1)/2.0;}}
}
public class CharacterSheetTools {
 public static CharacterPart[] Measure(string path) {
  using(var b=new Bitmap(path)) {
   int w=b.Width,h=b.Height;var mask=new byte[w*h];
   for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(b.GetPixel(x,y).A>=64)mask[y*w+x]=1;
   var parts=new CharacterPart[256];int partCount=0;var queue=new int[w*h];
   for(int start=0;start<mask.Length;start++) {
    if(mask[start]!=1)continue;int read=0,write=1;queue[0]=start;mask[start]=2;
    var p=new CharacterPart{X0=w,Y0=h,X1=0,Y1=0};
    while(read<write) {
     int index=queue[read++],x=index%w,y=index/w;p.Area++;
     p.X0=Math.Min(p.X0,x);p.X1=Math.Max(p.X1,x);p.Y0=Math.Min(p.Y0,y);p.Y1=Math.Max(p.Y1,y);
     for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++) {
      int xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;
      int ni=yy*w+xx;if(mask[ni]==1){mask[ni]=2;queue[write++]=ni;}
     }
    }
    if(p.Area>=1000)parts[partCount++]=p;
   }
   var result=new CharacterPart[partCount];Array.Copy(parts,result,partCount);return result;
  }
 }
 public static int[] Pack(string path,string output,string walkPath) {
  var parts=Measure(path);if(parts.Length!=32)throw new Exception("Expected 32 connected character poses.");
  using(var source=new Bitmap(path))using(var walk=String.IsNullOrEmpty(walkPath)?null:new Bitmap(walkPath))
  using(var atlas=new Bitmap(2048,1280,PixelFormat.Format32bppArgb)) {
   var rows=new CharacterPart[4][];var baseline=new int[4];
   for(int row=0;row<4;row++) {
    var ordered=new CharacterPart[8];int n=0;
    foreach(var part in parts)if((int)(part.CenterY/source.Height*4)==row) {
     if(n==8)throw new Exception("Too many poses in row.");ordered[n++]=part;
    }
    if(n!=8)throw new Exception("Expected eight poses in every row.");
    Array.Sort(ordered,(a,b)=>a.CenterX.CompareTo(b.CenterX));rows[row]=ordered;
    for(int col=0;col<8;col++)if(col!=6)baseline[row]=Math.Max(baseline[row],ordered[col].Y1+1);
   }
   CharacterPart[][] walkRows=null;var walkBaseline=new int[4];double walkScale=1;
   if(walk!=null) {
    var walkParts=Measure(walkPath);if(walkParts.Length!=16)throw new Exception("Expected sixteen walk poses.");
    walkRows=new CharacterPart[4][];double standingHeight=0,walkingHeight=0;
    for(int r=0;r<4;r++) {
     var ordered=new CharacterPart[4];int n=0;
     foreach(var p in walkParts)if((int)(p.CenterY/walk.Height*4)==r) {
      if(n==4)throw new Exception("Too many walking poses in row.");ordered[n++]=p;
     }
     if(n!=4)throw new Exception("Expected four walking poses in row.");
     Array.Sort(ordered,(a,b)=>a.CenterX.CompareTo(b.CenterX));walkRows[r]=ordered;
     for(int c=0;c<4;c++)walkBaseline[r]=Math.Max(walkBaseline[r],ordered[c].Y1+1);
     standingHeight+=rows[r][0].Y1-rows[r][0].Y0+1;
     for(int c=0;c<4;c+=2)walkingHeight+=ordered[c].Y1-ordered[c].Y0+1;
    }
    // A single resolution conversion for this entire supplemental sheet, never per-pose scaling.
    walkScale=(standingHeight/4)/(walkingHeight/8);
   }
   int minX=256,minY=320,maxX=0,maxY=0;
   for(int row=0;row<4;row++)for(int col=0;col<8;col++) {
    // The generated left-run toe touched the source edge; use its complete opposite profile.
    bool walking=walk!=null&&col>=1&&col<=4;
    bool mirror=row==1&&(walking||col==7);int sourceRow=mirror&&!walking?2:row;
    var image=walking?walk:source;
    var part=walking?walkRows[row][col-1]:rows[sourceRow][col];
    int ground=walking?walkBaseline[row]:baseline[sourceRow];double factor=walking?walkScale:1;
    if(part.X0==0||part.X1==image.Width-1||part.Y0==0||part.Y1==image.Height-1)
     throw new Exception("A selected source pose is clipped at the image boundary.");
    // Register the hip, not an independently resized bounding box or airborne shoe.
    int hip=HipCenter(image,part);
    for(int y=Math.Max(0,part.Y0-2);y<=Math.Min(image.Height-1,part.Y1+2);y++)
    for(int x=Math.Max(0,part.X0-2);x<=Math.Min(image.Width-1,part.X1+2);x++) {
     var c=image.GetPixel(x,y);
     // Discard only negligible-alpha export residue, retaining the opaque drawn character.
     if(c.A<32)continue;
     int tx=128+(int)Math.Round((mirror?hip-x:x-hip)*factor),ty=288+(int)Math.Round((y-ground)*factor);
     if(tx<4||ty<4||tx>=252||ty>=316)throw new Exception("Pose needs more atlas gutter.");
     atlas.SetPixel(col*256+tx,row*320+ty,c);
     minX=Math.Min(minX,tx);maxX=Math.Max(maxX,tx);minY=Math.Min(minY,ty);maxY=Math.Max(maxY,ty);
    }
   }
   atlas.Save(output,ImageFormat.Png);return new[]{minX,minY,maxX-minX+1,maxY-minY+1};
  }
 }
 static int HipCenter(Bitmap image,CharacterPart part) {
  int height=part.Y1-part.Y0+1,first=-1;long sum=0;int count=0;
  for(int y=part.Y0+(int)(height*.52);y<=part.Y0+(int)(height*.82);y++) {
   if(first>=0&&y>first+8)break;
   long rowSum=0;int rowCount=0;
   for(int x=part.X0;x<=part.X1;x++) {
    var c=image.GetPixel(x,y);
    if(c.A>=180&&c.R>=185&&c.R<=235&&c.G>=135&&c.G<=210&&c.B>=90&&c.B<=175) {
     rowSum+=x;rowCount++;
    }
   }
   if(first<0&&rowCount<8)continue;
   if(first<0)first=y;sum+=rowSum;count+=rowCount;
  }
  if(count<12)throw new Exception("Cannot measure the beige trouser hip anchor at "+part.X0+","+part.Y0+".");
  return (int)Math.Round((double)sum/count);
 }
}
'@
$sourceFile=(Resolve-Path -LiteralPath $SourceImage).Path
$image=[System.Drawing.Bitmap]::new($sourceFile)
$width=$image.Width;$height=$image.Height;$image.Dispose()
if($MeasureOnly) {
 $parts=[CharacterSheetTools]::Measure($sourceFile)
 [pscustomobject]@{width=$width;height=$height;parts=@($parts | Sort-Object CenterY | Select-Object X0,Y0,X1,Y1,Area,CenterX,CenterY)} | ConvertTo-Json -Depth 5
 exit
}
if(-not $Destination){throw 'Provide -Destination for the packed PNG.'}
$destinationFile=[System.IO.Path]::GetFullPath($Destination)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destinationFile)) | Out-Null
$walkFile=if($WalkSourceImage){(Resolve-Path -LiteralPath $WalkSourceImage).Path}else{''}
$bounds=[CharacterSheetTools]::Pack($sourceFile,$destinationFile,$walkFile)
$manifest=[ordered]@{columns=8;rows=4;sourceWidth=2048;sourceHeight=1280;
 crop=@{x=$bounds[0];y=$bounds[1];width=$bounds[2];height=$bounds[3]};anchor=@{x=128;y=288};
 directions=@('down','left','right','up');poses=@('idle','walk-contact-left','walk-pass-right','walk-contact-right','walk-pass-left','run-contact-left','run-airborne','run-contact-right');
 provenance=@{generator='Built-in imagegen, based on user-supplied character drawing';originalWidth=$width;originalHeight=$height;originalSha256=(Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash.ToLower();walkSha256=if($walkFile){(Get-FileHash -LiteralPath $walkFile -Algorithm SHA256).Hash.ToLower()}else{$null};packing='Hip registration; one ground baseline per row; one resolution conversion for the supplemental16-walk sheet; alpha below32 discarded; complete left profiles mirrored during atlas packing.'}}
$manifestFile=Join-Path ([System.IO.Path]::GetDirectoryName($destinationFile)) 'manifest.json'
[System.IO.File]::WriteAllText($manifestFile,($manifest|ConvertTo-Json -Depth 6)+"`n",[System.Text.UTF8Encoding]::new($false))
$manifest|ConvertTo-Json -Depth 6
