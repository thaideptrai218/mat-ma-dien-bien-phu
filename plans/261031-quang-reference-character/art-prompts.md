# Character art — prompts and selection

Mode: built-in imagegen. Reference: user-supplied illustrated Quang, not a real-person portrait. No fallback API/CLI. Final game asset: `assets/characters/quang-reference/motion-sheet.png` with local `manifest.json`; input drawing remains outside repo. Generated PNG candidates remain in the local imagegen output directory.

## Final full-sheet correction prompt

Edit target was the previous generated8×4 sheet, itself generated using the supplied drawing. Exact final correction request:

> Precise correction to this8-column4-row sprite sheet. Preserve the entire top row, third row and bottom row unchanged. Preserve the student, outfit, drawing style, all frame sizes/placements and background transparency. ONLY CORRECT THREE FIGURES: in the SECOND ROW, the LAST THREE characters (columns6,7,8) currently run toward the RIGHT but must run toward the LEFT, matching all five other figures in their second row. Flip those three entire poses horizontally so their noses, chest lean, knees and shoes all point left. Do not flip the walking figures in that row. Third row stays facing right. Exactly four rows with eight characters each. Keep the clean original outlined cartoon style, rust jacket/whiteTshirt/beigetrousers/olivebag. No text or grid. Completely transparent empty background, no colored particles or shadows. Do not change anything else.

The initial generation specification established32 full-body cells, row directions down/left/right/up, idle + four walk + three run poses, same outfit/scale, no scarf or military costume, transparent gutters, common ground baseline. Iterations corrected orientation. Low-alpha export residue was removed during technical packing. One clipped left-run shoe was replaced with the complete opposite-profile contact; rendered mirrored in the packed asset.

## Final supplemental walking prompt

This separate16-pose generation replaced walking columns1–4; original standing/running art stayed. Exact prompt:

> Draw a genuine FOUR-FRAME WALK CYCLE game animation sprite sheet of this exact young male student. Preserve his dark wavy brown hair, clean outlined flat-color cartoon illustration style, rust/brown open overshirt, white T-shirt, beige trousers, pale sneakers, and olive shoulder satchel. Slim natural human proportions. No pixel art, no chibi, no scarf/hat/weapons. Satchel stays attached to the same body side through the motion.
>
> ONE transparent sheet with EXACTLY FOUR COLUMNS and FOUR ROWS, sixteen full-body poses. Uniform frame centers, head/body size and grounded baseline,10% transparent safety space inside every cell, including outer edge cells. Top row faces front/DOWN, second row faces LEFT (noses to left), third row faces RIGHT (noses to right), bottom row back/UP. No text, no grid, no floor, no shadows, no glow or colored flecks.
>
> Columns form an actual alternating step, not repeated stride photographs. Column1: CONTACT — left leg forward and right leg back, both legs extended and feet horizontally well apart, right arm forward. Column2: PASSING — RIGHT foot passes directly underneath the hips with knee clearly bent and heel lifted; LEFT leg nearly vertical supporting the body, feet CLOSE horizontally together underneath body. Column3: OPPOSITE CONTACT — RIGHT leg forward and LEFT leg back, opposite leg overlaps/shading from column1, both legs extended and feet wide apart, LEFT arm forward. Column4: OPPOSITE PASSING — LEFT foot passes under hips with knee bent and heel lifted, RIGHT leg nearly vertical supporting body, feet CLOSE together; opposite bent knee and opposite arm from column2. For side rows the silhouette MUST alternate WIDE SPLIT LEGS, NARROW TOGETHER LEGS, WIDE SPLIT LEGS, NARROW TOGETHER LEGS. Passing figures must NOT retain a wide split-leg stance. Show clear far-leg/near-leg alternation with flat shading. Do not repeat the same foot forward in both contact frames. For front/back rows alternate clearly which shoe/knee advances toward the viewer. Small torso/shoulder bob only, no scaling or changing camera distance. This is a technically usable animation cycle, same hips center in every frame. Preserve the supplied student outfit faithfully.

Packing uses a single measured resolution conversion for all16 supplemental walk poses, preserving their relative sizes; complete left profiles are mirrored when necessary. Real PNG checks verify nonempty/unique32 tiles, alpha gutters/crop, wide/narrow side silhouettes and raised airborne run shoes. Human visual playback remains a separate check from silhouette measurements.

Unresolved questions: none blocking the requested sprite replacement.
