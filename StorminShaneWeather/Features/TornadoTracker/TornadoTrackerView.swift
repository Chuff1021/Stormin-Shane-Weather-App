import SwiftUI

struct TornadoTrackerView: View {
    var body: some View { ZStack { StormTheme.backgroundGradient.ignoresSafeArea(); VStack(alignment: .leading, spacing: 18) { HStack { Image(systemName: "tornado").font(.largeTitle).foregroundStyle(StormTheme.warningRed); VStack(alignment: .leading) { Text("Tornado Tracker").font(.largeTitle.bold()); Text("Warnings, watches, SPC risk, storm reports").foregroundStyle(.secondary) } }; VStack(alignment: .leading, spacing: 12) { Text("Flagship roadmap").font(.headline); row("NWS active warning polygons"); row("SPC Day 1–8 outlook overlays"); row("Local Storm Reports / tornado tracks"); row("Critical alert workflow"); row("Chasers Near Me via public APIs") }.padding().glassCard(); Spacer() }.padding(20) } }
    private func row(_ title: String) -> some View { HStack { Image(systemName: "circle").foregroundStyle(.secondary); Text(title) } }
}
