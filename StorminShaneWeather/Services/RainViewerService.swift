import Foundation

final class RainViewerService {
    func timeline() async throws -> RainViewerTimeline {
        let url = URL(string: "https://api.rainviewer.com/public/weather-maps.json")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(RainViewerTimeline.self, from: data)
    }
}

struct RainViewerTimeline: Decodable { let host: String; let radar: Radar; struct Radar: Decodable { let past: [Frame]; let nowcast: [Frame]? }; struct Frame: Decodable, Identifiable { var id: Int { time }; let time: Int; let path: String } }
