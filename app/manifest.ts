import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name:"Stormin' Shane Weather", short_name:'Stormin Shane', start_url:'/', scope:'/', display:'standalone', background_color:'#0b1220', theme_color:'#0b1220', orientation:'portrait', icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'}] } }
