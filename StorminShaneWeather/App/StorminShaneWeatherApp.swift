import SwiftUI

@main
struct StorminShaneWeatherApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(appState)
                .preferredColorScheme(.dark)
        }
    }
}
