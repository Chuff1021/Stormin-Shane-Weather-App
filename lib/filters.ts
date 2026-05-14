// WebGL filter chain used by the in-browser video studio.
// Each filter is a fragment shader that samples u_tex and writes the filtered color.
// Filters are designed to make a casual phone clip look broadcast-grade.

export type FilterId =
  | "natural"
  | "news_anchor"
  | "golden_hour"
  | "cinematic"
  | "storm"
  | "vintage_broadcast";

export const FILTERS: { id: FilterId; label: string; blurb: string }[] = [
  { id: "natural", label: "Natural", blurb: "No correction. Raw camera." },
  { id: "news_anchor", label: "News Anchor", blurb: "Skin warmth, lifted shadows, subtle vignette." },
  { id: "golden_hour", label: "Golden Hour", blurb: "Sunset warmth, soft highlights." },
  { id: "cinematic", label: "Cinematic", blurb: "Teal/orange film grade with letterbox." },
  { id: "storm", label: "Storm", blurb: "Cool, dramatic contrast for storm footage." },
  { id: "vintage_broadcast", label: "Vintage TV", blurb: "70s news desk feel with scanlines." },
];

export const VERT = /* glsl */ `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main(){
  v_uv = a_uv;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const COMMON = /* glsl */ `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform float u_time;

vec3 saturate(vec3 c, float s){
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  return mix(vec3(l), c, s);
}

float vignette(vec2 uv, float strength, float softness){
  vec2 p = uv - 0.5;
  float r = length(p) * 1.41421;
  return 1.0 - smoothstep(softness, 1.0, r) * strength;
}

// teal/orange split toning
vec3 splitTone(vec3 c, vec3 shadows, vec3 highlights){
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 toned = mix(shadows, highlights, l);
  return mix(c, c * toned, 0.55);
}

// pseudo film grain
float grain(vec2 uv, float t){
  return fract(sin(dot(uv * (t + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
}
`;

export const FRAG: Record<FilterId, string> = {
  natural: COMMON + /* glsl */ `
    void main(){ gl_FragColor = texture2D(u_tex, v_uv); }`,

  news_anchor: COMMON + /* glsl */ `
    void main(){
      vec3 c = texture2D(u_tex, v_uv).rgb;
      // lift shadows
      c = pow(c, vec3(0.92));
      // warm skin
      c.r *= 1.06; c.g *= 1.02; c.b *= 0.97;
      // gentle saturation
      c = saturate(c, 1.08);
      // subtle vignette
      c *= vignette(v_uv, 0.35, 0.55);
      gl_FragColor = vec4(c, 1.0);
    }`,

  golden_hour: COMMON + /* glsl */ `
    void main(){
      vec3 c = texture2D(u_tex, v_uv).rgb;
      c.r *= 1.12; c.g *= 1.04; c.b *= 0.88;
      c = c + vec3(0.04, 0.02, -0.02);
      c = saturate(c, 1.15);
      c *= vignette(v_uv, 0.45, 0.5);
      gl_FragColor = vec4(c, 1.0);
    }`,

  cinematic: COMMON + /* glsl */ `
    void main(){
      vec3 c = texture2D(u_tex, v_uv).rgb;
      // teal shadows, orange highlights
      c = splitTone(c, vec3(0.85, 0.95, 1.15), vec3(1.15, 1.05, 0.85));
      c = saturate(c, 0.95);
      c = pow(c, vec3(1.05));
      // letterbox bars
      float bar = step(0.93, abs(v_uv.y - 0.5) * 2.0);
      c *= 1.0 - bar;
      c *= vignette(v_uv, 0.4, 0.5);
      // soft grain
      float g = (grain(v_uv, u_time) - 0.5) * 0.04;
      c += g;
      gl_FragColor = vec4(c, 1.0);
    }`,

  storm: COMMON + /* glsl */ `
    void main(){
      vec3 c = texture2D(u_tex, v_uv).rgb;
      c = splitTone(c, vec3(0.7, 0.85, 1.25), vec3(1.05, 1.0, 1.1));
      // crush blacks for drama
      c = pow(c, vec3(1.18));
      c = saturate(c, 0.85);
      c *= vignette(v_uv, 0.55, 0.45);
      gl_FragColor = vec4(c, 1.0);
    }`,

  vintage_broadcast: COMMON + /* glsl */ `
    void main(){
      vec3 c = texture2D(u_tex, v_uv).rgb;
      // warm vintage tint
      c.r = c.r * 1.05 + 0.02;
      c.g = c.g * 0.97;
      c.b = c.b * 0.85;
      c = saturate(c, 0.9);
      // scanlines
      float scan = 0.85 + 0.15 * sin(v_uv.y * u_res.y * 1.6);
      c *= scan;
      // chromatic aberration on edges
      float ca = 0.003;
      c.r = texture2D(u_tex, v_uv + vec2(ca, 0.0)).r;
      c.b = texture2D(u_tex, v_uv - vec2(ca, 0.0)).b;
      c *= vignette(v_uv, 0.5, 0.5);
      gl_FragColor = vec4(c, 1.0);
    }`,
};
