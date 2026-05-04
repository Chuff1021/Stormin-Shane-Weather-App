import Foundation

struct SavedLocation: Identifiable, Hashable { let id = UUID(); var name: String; var latitude: Double; var longitude: Double }

struct CurrentWeather {
    var temperature: Int; var feelsLike: Int; var condition: String; var high: Int; var low: Int; var windMph: Int; var windDirection: String; var humidity: Int; var dewPoint: Int; var pressure: String; var visibility: String
    static let placeholder = CurrentWeather(temperature: 72, feelsLike: 74, condition: "Storms Developing", high: 78, low: 61, windMph: 18, windDirection: "SW", humidity: 68, dewPoint: 61, pressure: "29.82 ↓", visibility: "9 mi")
}

struct HourlyForecast: Identifiable { let id = UUID(); var hour: String; var temperature: Int; var precipChance: Int; var symbol: String
    static let placeholders = [HourlyForecast(hour: "Now", temperature: 72, precipChance: 35, symbol: "cloud.bolt.rain.fill"), HourlyForecast(hour: "5 PM", temperature: 71, precipChance: 55, symbol: "cloud.rain.fill"), HourlyForecast(hour: "6 PM", temperature: 69, precipChance: 70, symbol: "cloud.heavyrain.fill"), HourlyForecast(hour: "7 PM", temperature: 67, precipChance: 45, symbol: "cloud.rain.fill"), HourlyForecast(hour: "8 PM", temperature: 65, precipChance: 20, symbol: "cloud.fill")]
}

struct DailyForecast: Identifiable { let id = UUID(); var day: String; var condition: String; var high: Int; var low: Int; var symbol: String
    static let placeholders = [DailyForecast(day: "Today", condition: "Strong storms", high: 78, low: 61, symbol: "cloud.bolt.rain.fill"), DailyForecast(day: "Tue", condition: "Showers", high: 70, low: 55, symbol: "cloud.rain.fill"), DailyForecast(day: "Wed", condition: "Partly cloudy", high: 73, low: 52, symbol: "cloud.sun.fill"), DailyForecast(day: "Thu", condition: "Sunny", high: 76, low: 54, symbol: "sun.max.fill")]
}

struct WeatherAlert: Identifiable { let id = UUID(); var title: String; var severity: String; var expires: String
    static let placeholders = [WeatherAlert(title: "Severe Thunderstorm Watch", severity: "Moderate", expires: "Until 9:00 PM")]
}
