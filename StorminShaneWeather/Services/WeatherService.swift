import Foundation

final class WeatherService {
    private let session: URLSession
    private let userAgent = "StorminShaneWeather/0.1 (https://github.com/Chuff1021/Stormin-Shane-Weather-App)"
    init(session: URLSession = .shared) { self.session = session }

    func nwsPoints(latitude: Double, longitude: Double) async throws -> NWSPointResponse {
        let url = URL(string: "https://api.weather.gov/points/\(latitude),\(longitude)")!
        var request = URLRequest(url: url)
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        request.setValue("application/geo+json", forHTTPHeaderField: "Accept")
        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(NWSPointResponse.self, from: data)
    }

    func activeAlerts(latitude: Double, longitude: Double) async throws -> NWSAlertsResponse {
        let url = URL(string: "https://api.weather.gov/alerts/active?point=\(latitude),\(longitude)")!
        var request = URLRequest(url: url)
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(NWSAlertsResponse.self, from: data)
    }
}

struct NWSPointResponse: Decodable { let properties: Properties; struct Properties: Decodable { let forecast: URL; let forecastHourly: URL; let forecastOffice: URL?; let gridId: String; let gridX: Int; let gridY: Int } }
struct NWSAlertsResponse: Decodable { let features: [Feature]; struct Feature: Decodable { let properties: Properties }; struct Properties: Decodable { let event: String; let severity: String; let expires: String?; let headline: String?; let description: String? } }
