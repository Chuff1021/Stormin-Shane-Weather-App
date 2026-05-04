import SwiftUI

struct SettingsView: View {
    var body: some View { NavigationStack { ZStack { StormTheme.backgroundGradient.ignoresSafeArea(); List { Section("Saved Locations") { Label("Current Location", systemImage: "location.fill"); Label("Add Home / Family Location", systemImage: "plus.circle") }; Section("Notifications") { Toggle("Tornado Warnings", isOn: .constant(true)); Toggle("Severe Thunderstorm Warnings", isOn: .constant(true)); Toggle("Shane's Updates", isOn: .constant(true)) }; Section("Accessibility") { Toggle("Color-blind radar palette", isOn: .constant(false)); Toggle("Reduce motion", isOn: .constant(false)) } }.scrollContentBackground(.hidden) }.navigationTitle("Settings") } }
}
