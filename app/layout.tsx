import type { Metadata, Viewport } from 'next';
import './styles.css';
export const metadata: Metadata = { title: "Stormin' Shane Weather", description: "Live weather, radar, alerts, and Shane updates.", manifest:'/manifest.webmanifest', appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'Stormin Shane'}, icons:{icon:'/icon.svg',apple:'/icon.svg'} };
export const viewport: Viewport = { width:'device-width', initialScale:1, maximumScale:1, viewportFit:'cover', themeColor:'#0b1220' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
