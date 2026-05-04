import Foundation

@MainActor
final class AppState: ObservableObject {
    @Published var selectedLocation = SavedLocation(name: "Current Location", latitude: 40.4173, longitude: -82.9071)
    @Published var savedLocations: [SavedLocation] = [SavedLocation(name: "Current Location", latitude: 40.4173, longitude: -82.9071)]
    @Published var currentWeather: CurrentWeather = .placeholder
    @Published var hourly: [HourlyForecast] = HourlyForecast.placeholders
    @Published var daily: [DailyForecast] = DailyForecast.placeholders
    @Published var alerts: [WeatherAlert] = WeatherAlert.placeholders
    let weatherService = WeatherService()
}
