import SwiftUI

enum StormTheme {
    static let background = Color(red: 0.025, green: 0.035, blue: 0.055)
    static let cyan = Color(red: 0.0, green: 0.82, blue: 1.0)
    static let amber = Color(red: 1.0, green: 0.67, blue: 0.12)
    static let warningRed = Color(red: 1.0, green: 0.12, blue: 0.16)
    static let cardStroke = Color.white.opacity(0.16)
    static var backgroundGradient: LinearGradient { LinearGradient(colors: [background, Color(red: 0.04, green: 0.07, blue: 0.12)], startPoint: .top, endPoint: .bottom) }
}

struct GlassCard: ViewModifier {
    func body(content: Content) -> some View {
        content.background(.ultraThinMaterial.opacity(0.85), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 28, style: .continuous).stroke(StormTheme.cardStroke, lineWidth: 1))
            .shadow(color: .black.opacity(0.25), radius: 24, x: 0, y: 18)
    }
}

extension View { func glassCard() -> some View { modifier(GlassCard()) } }
