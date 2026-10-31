import {CAMPAIGN_KEY,createCampaignState,sanitizeCampaign,audioSettings,currentRoom} from './state.js';

/** Keeps this campaign entirely separate from every standalone room's save. */
export class CampaignStore {
  constructor(storage, onChange = () => {}) {
    this.storage=storage; this.onChange=onChange; this.notice='';
    try { this.state=sanitizeCampaign(JSON.parse(storage?.getItem(CAMPAIGN_KEY) || 'null')); }
    catch { this.state=createCampaignState(); this.notice='Không đọc được hành trình đã lưu. Bạn vẫn có thể chơi trong phiên này.'; }
    if (!storage) this.notice='Trình duyệt không cho lưu tiến độ. Hành trình vẫn chơi được trong phiên này.';
  }
  update(next) {
    this.state=sanitizeCampaign(next);
    try {
      if (!this.storage) throw new Error('unavailable');
      this.storage.setItem(CAMPAIGN_KEY,JSON.stringify(this.state));
      this.notice='';
    } catch { this.notice='Không lưu được hành trình. Tiến độ hiện tại vẫn được giữ trong phiên này.'; }
    this.onChange(this.state);
  }
  begin() { this.update({...this.state,introSeen:true}); }
  // Sound switch chosen outside a room (museum frames); rooms read it back through their save adapter.
  setAudio(audioEnabled) { this.update({...this.state,settings:audioSettings({...this.state.settings,audioEnabled})}); }
  finish() { this.update({...this.state,endingSeen:true}); }
  reset() { this.update(createCampaignState()); }
  adapter(room, key) {
    return {
      getItem: requested => requested === key ? JSON.stringify({version:1,...this.state.rooms[room],...this.state.settings}) : null,
      setItem: (requested,text) => {
        if (requested !== key) throw new Error('Unexpected room save key');
        if (room !== currentRoom(this.state) || !this.state.introSeen) return;
        const value=JSON.parse(text);
        this.update({...this.state,settings:audioSettings(value),rooms:{...this.state.rooms,[room]:value}});
      },
    };
  }
}
