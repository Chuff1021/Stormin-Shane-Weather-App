import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView().tabItem { Label("Home", systemImage: "cloud.bolt.rain.fill") }
            RadarView().tabItem { Label("Radar", systemImage: "map.fill") }
            TornadoTrackerView().tabItem { Label("Tornado", systemImage: "tornado") }
            CreatorDashboardView().tabItem { Label("Shane", systemImage: "video.fill") }
            SettingsView().tabItem { Label("Settings", systemImage: "gearshape.fill") }
        }
        .tint(StormTheme.cyan)
    }
}
