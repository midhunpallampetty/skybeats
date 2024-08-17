declare module 'vanta/dist/vanta.fog.min' {
    export interface VantaEffect {
      new (options: any): any;
      destroy(): void;
    }
  
    export default function FOG(options: any): VantaEffect;
  }
  