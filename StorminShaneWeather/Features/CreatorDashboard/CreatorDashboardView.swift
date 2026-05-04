import SwiftUI
import LocalAuthentication

struct CreatorDashboardView: View {
    @State private var unlocked = false
    var body: some View { ZStack { StormTheme.backgroundGradient.ignoresSafeArea(); if unlocked { dashboard } else { locked } } }
    private var locked: some View { VStack(spacing: 18) { Image(systemName: "lock.shield.fill").font(.system(size: 56)).foregroundStyle(StormTheme.cyan); Text("Shane's Dashboard").font(.largeTitle.bold()); Text("Face ID / passcode gate for recording, uploads, drafts, analytics, and publishing.").multilineTextAlignment(.center).foregroundStyle(.secondary); Button("Unlock Creator Mode") { authenticate() }.buttonStyle(.borderedProminent).tint(StormTheme.cyan) }.padding(24).glassCard().padding() }
    private var dashboard: some View { ScrollView { VStack(alignment: .leading, spacing: 16) { Text("Creator Mode").font(.largeTitle.bold()); Button {} label: { Label("Quick Record Weather Update", systemImage: "record.circle.fill").font(.title3.bold()).frame(maxWidth: .infinity).padding() }.buttonStyle(.borderedProminent).tint(StormTheme.warningRed); section("Drafts & Scheduled Posts", "Upload, trim, tag weather event, schedule, publish."); section("Published Feed", "TikTok-style public Shane updates feed."); section("Analytics", "Views, watch time, region-level heatmap only.") }.padding(20) } }
    private func section(_ title: String, _ subtitle: String) -> some View { VStack(alignment: .leading, spacing: 6) { Text(title).font(.headline); Text(subtitle).foregroundStyle(.secondary) }.frame(maxWidth: .infinity, alignment: .leading).padding().glassCard() }
    private func authenticate() { let context = LAContext(); var error: NSError?; if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) { context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Unlock Shane's creator dashboard") { success, _ in Task { @MainActor in unlocked = success } } } else { unlocked = true } }
}
