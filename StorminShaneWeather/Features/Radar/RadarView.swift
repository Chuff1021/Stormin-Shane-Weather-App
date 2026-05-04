import SwiftUI
import MapKit

struct RadarView: View {
    @State private var camera = MapCameraPosition.region(MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 40.4173, longitude: -82.9071), span: MKCoordinateSpan(latitudeDelta: 5, longitudeDelta: 5)))
    var body: some View { ZStack(alignment: .bottom) { Map(position: $camera).mapStyle(.hybrid(elevation: .realistic)).ignoresSafeArea(); VStack(spacing: 12) { HStack { Label("RainViewer Radar", systemImage: "dot.radiowaves.left.and.right").font(.headline); Spacer(); Button("Layers") {}.buttonStyle(.borderedProminent).tint(StormTheme.cyan) }; Text("Next: overlay RainViewer tile frames, time scrubber, NOAA/IEM fallback, velocity, satellite, lightning, and storm tracks.").font(.caption).foregroundStyle(.secondary) }.padding().glassCard().padding() } }
}
