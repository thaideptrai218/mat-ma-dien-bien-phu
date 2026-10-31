/** Serializes resource disposal; a newer request invalidates every pending mount. */
export class SessionHost {
  constructor() { this.epoch=0; this.active=null; this.queue=Promise.resolve(); }
  replace(factory) {
    const epoch=++this.epoch;
    const operation=this.queue.catch(()=>{}).then(async()=>{
      if (this.active) {
        const previous=this.active; this.active=null;
        await previous.destroy();
      }
      if (epoch !== this.epoch) return;
      const mount=await factory.prepare();
      if (epoch !== this.epoch) return;
      const session=mount();
      if (epoch !== this.epoch) { await session?.destroy?.(); return; }
      this.active=session || null;
    });
    this.queue=operation;
    return operation;
  }
}
