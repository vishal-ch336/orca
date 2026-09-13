# Orca Backend — API Contract v1

> **Handoff document for frontend development.**
> All examples below are real responses captured from a live local instance on 2026-09-12.
> Base URL (local dev): `http://localhost:8000`
> Interactive docs: `http://localhost:8000/docs`

---

## Table of Contents

1. [POST /api/query](#1-post-apiquery) — main chat/query endpoint
2. [GET /debug/map-payload](#2-get-debugmap-payload) — GeoJSON for the map view
3. [GET /debug/risk](#3-get-debugrisk) — raw risk assessment
4. [GET /debug/nearest-pfz](#4-get-debugnearest-pfz) — nearest PFZ advisories
5. [GET /debug/boundary-check](#5-get-debugboundary-check) — EEZ proximity check
6. [GET /debug/alerts](#6-get-debugalerts) — active alerts
7. [GET /health](#7-get-health) — liveness probe
8. [Frontend Integration Notes](#8-frontend-integration-notes)

---

## 1. POST /api/query

The primary endpoint. Accepts a natural-language query plus the user's location.
Runs the full LangGraph orchestrator pipeline and returns an LLM-synthesised response.

### Request

```
POST /api/query
Content-Type: application/json
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | ✅ | Natural-language question from the user |
| `lat` | float \| null | see note | User latitude (WGS-84) |
| `lon` | float \| null | see note | User longitude (WGS-84) |

> **Location requirement:** `lat`/`lon` are **required** for intents `safety_check`, `nearest_pfz`, `alerts_check`, and `conditions`. If omitted for those intents, the API returns an immediate structured error (no pipeline run, see Example 4). For `general` intent queries they are optional.

### Response — `200 OK`

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | Original query echoed back |
| `intent` | string | Detected intent (see Intent Types below) |
| `final_response` | string | LLM-generated natural-language answer |
| `evidence` | array | Evidence items collected by agents (see Evidence schema) |
| `verdict` | string \| null | Risk verdict — `"safe"`, `"caution"`, `"unsafe"`, or `null` |
| `risk_score` | int \| null | 0–100 numeric risk score, or `null` |
| `alerts_count` | int | Number of active alerts |
| `visualization_available` | bool | Whether `/debug/map-payload` will return meaningful data |
| `generated_at` | ISO 8601 string | Timestamp of response generation |
| `raw` | null | Reserved for debug mode (always `null` in production) |

#### Intent Types

| Value | Meaning |
|-------|---------|
| `safety_check` | "Is it safe to go fishing?" |
| `nearest_pfz` | "Where is the nearest fishing zone?" |
| `conditions` | "What are the sea conditions?" |
| `alerts_check` | "Are there any alerts?" |
| `general` | Anything else — answered directly, marine context suppressed |

#### Evidence Item Schema

```json
{
  "source": "weather_agent",
  "description": "Wind 13.1 km/h, waves 1.2m, swell 0.88m, SST 29.4°C",
  "timestamp": "2026-09-12T09:31:51.423168"
}
```

**Evidence sources:** `orchestrator`, `weather_agent`, `marine_data_agent`, `geospatial_agent`, `risk_agent`, `pfz_ranker`, `alert_agent`

---

### Example 1 — `safety_check` (SAFE verdict)

**Request:**
```json
{
  "query": "Is it safe to go fishing today?",
  "lat": 17.6868,
  "lon": 83.2185
}
```

**Response:**
```json
{
  "query": "Is it safe to go fishing today?",
  "intent": "safety_check",
  "final_response": "**SAFE** — It is generally safe to go fishing today off the Visakhapatnam coast, as current marine conditions show mild winds of 13.1 km/h, manageable wave heights of 1.2m, and a swell of 0.88m (source: Open-Meteo, fetched 2026-09-12 09:31 UTC). However, please note that there is 1 active medium-severity alert and you are currently 5.1km from the India EEZ boundary. You may proceed with your trip while keeping a close eye on local weather updates, and ensure you stay well within the EEZ limits.",
  "evidence": [
    { "source": "orchestrator", "description": "Intent classified as 'safety_check', language detected as 'English'", "timestamp": "2026-09-12T09:31:49.157421" },
    { "source": "weather_agent", "description": "Wind 13.1 km/h, waves 1.2m, swell 0.88m, SST 29.4°C", "timestamp": "2026-09-12T09:31:51.423168" },
    { "source": "geospatial_agent", "description": "Nearest station: Visakhapatnam at 0.0km", "timestamp": "2026-09-12T09:31:49.957117" },
    { "source": "risk_agent", "description": "Verdict: SAFE, risk score: 0/100", "timestamp": "2026-09-12T09:31:51.663543" },
    { "source": "risk_agent", "description": "No adverse conditions detected", "timestamp": "2026-09-12T09:31:51.663553" },
    { "source": "alert_agent", "description": "1 active alert(s), highest severity: medium", "timestamp": "2026-09-12T09:31:51.751513" }
  ],
  "verdict": "safe",
  "risk_score": 0,
  "alerts_count": 1,
  "visualization_available": true,
  "generated_at": "2026-09-12T09:31:53.445162",
  "raw": null
}
```

---

### Example 2 — `nearest_pfz` (station coordinates in response)

**Request:**
```json
{
  "query": "Where is the nearest fishing zone?",
  "lat": 17.6868,
  "lon": 83.2185
}
```

**Response:**
```json
{
  "query": "Where is the nearest fishing zone?",
  "intent": "nearest_pfz",
  "final_response": "The nearest Potential Fishing Zone (PFZ) is right here at Visakhapatnam (0.0km away) at coordinates lat=17.6868, lon=83.2185, and conditions are currently **SAFE** for fishing. Based on Open-Meteo data fetched on 2026-09-12 at 09:31:51, the area has calm waters with a wave height of 1.2m and a wind speed of 13.1 km/h. Please note there is 1 active medium-severity alert as you are 5.1km from the India EEZ (AP Coast segment). You can safely head to the Visakhapatnam station coordinates to begin your fishing operations.",
  "evidence": [
    { "source": "orchestrator", "description": "Intent classified as 'nearest_pfz', language detected as 'English'", "timestamp": "2026-09-12T09:31:54.565815" },
    { "source": "weather_agent", "description": "Wind 13.1 km/h, waves 1.2m, swell 0.88m, SST 29.4°C", "timestamp": "2026-09-12T09:31:54.568440" },
    { "source": "pfz_ranker", "description": "Station Visakhapatnam (0.0km away): verdict=SAFE — no adverse conditions", "timestamp": "2026-09-12T09:31:56.359782" },
    { "source": "pfz_ranker", "description": "Station Bheemunipatnam (31.76km away): verdict=SAFE — no adverse conditions", "timestamp": "2026-09-12T09:31:56.359821" },
    { "source": "pfz_ranker", "description": "Station Srikakulam (Calingapatnam) (108.16km away): verdict=CAUTION — wave height 1.6m is moderate (>1.5m)", "timestamp": "2026-09-12T09:31:56.359864" },
    { "source": "pfz_ranker", "description": "Station Uppada (116.73km away): verdict=SAFE — no adverse conditions", "timestamp": "2026-09-12T09:31:56.359889" },
    { "source": "pfz_ranker", "description": "Station Kakinada (133.28km away): verdict=SAFE — no adverse conditions", "timestamp": "2026-09-12T09:31:56.359923" },
    { "source": "alert_agent", "description": "1 active alert(s), highest severity: medium", "timestamp": "2026-09-12T09:31:56.422991" }
  ],
  "verdict": null,
  "risk_score": null,
  "alerts_count": 1,
  "visualization_available": true,
  "generated_at": "2026-09-12T09:31:57.965093",
  "raw": null
}
```

---

### Example 3 — `general` intent (marine context suppressed)

**Request:**
```json
{
  "query": "What is the capital of France?",
  "lat": 17.6868,
  "lon": 83.2185
}
```

**Response:**
```json
{
  "query": "What is the capital of France?",
  "intent": "general",
  "final_response": "The capital of France is Paris.",
  "evidence": [
    { "source": "orchestrator", "description": "Intent classified as 'general', language detected as 'English'", "timestamp": "2026-09-12T09:32:10.765172" },
    { "source": "weather_agent", "description": "Wind 13.1 km/h, waves 1.2m, swell 0.88m, SST 29.4°C", "timestamp": "2026-09-12T09:32:10.770931" },
    { "source": "alert_agent", "description": "1 active alert(s), highest severity: medium", "timestamp": "2026-09-12T09:32:10.861421" }
  ],
  "verdict": null,
  "risk_score": null,
  "alerts_count": 1,
  "visualization_available": true,
  "generated_at": "2026-09-12T09:32:11.878552",
  "raw": null
}
```

> **Note:** `final_response` is just "Paris." — no wave heights or alerts injected. The `evidence` array still captures agent activity, but the LLM output is scoped to the actual query.

---

### Example 4 — Missing location guard (contract violation response)

When `lat`/`lon` are omitted for a location-dependent query, the pipeline does **not** run and returns immediately.

**Request:**
```json
{ "query": "Is it safe to go fishing today?" }
```

**Response:**
```json
{
  "query": "Is it safe to go fishing today?",
  "intent": "safety_check",
  "final_response": "Location required: this query needs your current coordinates to give a meaningful answer. Please provide lat/lon and retry.",
  "evidence": [],
  "verdict": null,
  "risk_score": null,
  "alerts_count": 0,
  "visualization_available": false,
  "generated_at": "2026-09-12T09:32:11.942237",
  "raw": null
}
```

> **Frontend note:** In normal operation the frontend always captures location before sending a query, so this case should never occur in production. It is a backend contract safety net only.

---

## 2. GET /debug/map-payload

Returns a valid **GeoJSON FeatureCollection** for the Leaflet/MapLibre map view.
Contains user location pin, PFZ advisory points, and the EEZ boundary polygon.

```
GET /debug/map-payload?lat=17.6868&lon=83.2185
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | float | ✅ | User latitude |
| `lon` | float | ✅ | User longitude |

### Feature layers

Each feature has a `properties.layer` field identifying its type:

| `layer` | Geometry type | Purpose |
|---------|---------------|---------|
| `"user_location"` | Point | User's current position |
| `"pfz_advisory"` | Point | PFZ station with fishing advisory |
| `"eez_boundary"` | MultiPolygon | India EEZ (AP Coast segment) |

### `user_location` feature

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [83.2185, 17.6868] },
  "properties": {
    "layer": "user_location",
    "label": "Your location",
    "icon": "marker"
  }
}
```

### `pfz_advisory` feature

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [83.43, 17.89] },
  "properties": {
    "layer": "pfz_advisory",
    "station_name": "Bheemunipatnam",
    "forecast_date": "2026-09-04",
    "sst_value": 28.9266,
    "chlorophyll_value": null,
    "advisory_text": "SE | 151 | dist=50-55 | depth=367-372 | bathy=-439.0",
    "distance_km": 31.76,
    "icon": "fish"
  }
}
```

`advisory_text` format: `DIRECTION | fish_index | dist=Xkm-Ykm | depth=Xm-Ym | bathy=Zm`

### `eez_boundary` feature (abbreviated)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [ [ [ [79.224, 10.005], [79.225, 10.007], "... thousands of vertices ..." ] ] ]
  },
  "properties": {
    "layer": "eez_boundary",
    "name": "India EEZ (AP Coast segment)",
    "zone_type": "eez",
    "source": "Marine Regions / VLIZ World EEZ v12 — clipped to AP/BoB region (lon 78-90, lat 10-21)"
  }
}
```

> **Note:** The EEZ polygon is real World EEZ v12 geometry, not a placeholder. Area ≈ 532,659 km². The coordinate array is large (~700KB); the frontend should treat it as an opaque geometry layer — don't attempt to parse or display individual vertices.

---

## 3. GET /debug/risk

Raw risk assessment for a point. Use this to drive a standalone risk/conditions card.

```
GET /debug/risk?lat=17.6868&lon=83.2185
```

**Example response:**
```json
{
  "verdict": "safe",
  "risk_score": 0,
  "contributing_factors": ["No adverse conditions detected"],
  "evidence": [
    { "source": "weather_agent", "description": "Significant wave height: 1.2m (within safe limits)", "timestamp": "2026-09-12T09:32:58.412264" },
    { "source": "weather_agent", "description": "Wind speed at 10m: 13.1 km/h (within safe limits)", "timestamp": "2026-09-12T09:32:58.412277" },
    { "source": "weather_agent", "description": "Swell wave height: 0.9m (within safe limits)", "timestamp": "2026-09-12T09:32:58.412285" },
    { "source": "geospatial_agent", "description": "EEZ zone 'India EEZ (AP Coast segment)' at 5.1km", "timestamp": "2026-09-12T09:32:58.412295" }
  ],
  "generated_at": "2026-09-12T09:32:58.412333",
  "weather_snapshot": {
    "wind_speed": 13.1,
    "wind_direction": 203.0,
    "wave_height": 1.2,
    "wave_direction": 173.0,
    "swell_height": 0.88,
    "sea_surface_temp": 29.4,
    "source": "open_meteo",
    "fetched_at": "2026-09-12T09:31:51.402114",
    "is_error": false,
    "error_message": null
  },
  "boundary_alerts": [
    {
      "zone_id": 2,
      "name": "India EEZ (AP Coast segment)",
      "zone_type": "eez",
      "distance_km": 5.14,
      "is_inside": false
    }
  ]
}
```

#### Verdict thresholds

| `verdict` | Wave height | Wind speed | Swell height |
|-----------|-------------|------------|--------------|
| `"safe"` | < 1.5m | < 30 km/h | < 1.5m |
| `"caution"` | 1.5–2.5m | 30–50 km/h | 1.5–2.5m |
| `"unsafe"` | > 2.5m | > 50 km/h | > 2.5m |

---

## 4. GET /debug/nearest-pfz

Raw PFZ advisory records ordered by distance from the user. Up to 5 returned.

```
GET /debug/nearest-pfz?lat=17.6868&lon=83.2185
```

**Example response:**
```json
[
  {
    "advisory_id": 9,
    "station_id": 8,
    "station_name": "Visakhapatnam",
    "station_lat": 17.6868,
    "station_lon": 83.2185,
    "forecast_date": "2026-09-04",
    "sst_value": 29.12,
    "chlorophyll_value": null,
    "advisory_text": "SE | 97 | dist=30-35 | depth=376-381 | bathy=-472.0",
    "distance_km": 0.0
  },
  {
    "advisory_id": 15,
    "station_id": 9,
    "station_name": "Bheemunipatnam",
    "station_lat": 17.89,
    "station_lon": 83.43,
    "forecast_date": "2026-09-04",
    "sst_value": 28.93,
    "chlorophyll_value": null,
    "advisory_text": "SE | 151 | dist=50-55 | depth=367-372 | bathy=-439.0",
    "distance_km": 31.76
  }
]
```

---

## 5. GET /debug/boundary-check

Checks all EEZ / boundary zones for distance and containment at a given point.

```
GET /debug/boundary-check?lat=17.6868&lon=83.2185
```

**Example response:**
```json
[
  {
    "zone_id": 2,
    "name": "India EEZ (AP Coast segment)",
    "zone_type": "eez",
    "distance_km": 5.14,
    "is_inside": false
  }
]
```

> **Interpretation:** `is_inside: false` means the point is on the coastal (landward) side of the EEZ inner boundary. Offshore points (e.g. lat=17.0, lon=84.0) return `is_inside: true, distance_km: 0.0`. The known real near-boundary test point is **lat=17.70, lon=83.30** (0.4km outside the boundary).

---

## 6. GET /debug/alerts

Returns structured active alert summary for a location.

```
GET /debug/alerts?lat=17.6868&lon=83.2185
```

**Example response:**
```json
{
  "total_count": 1,
  "highest_severity": "medium",
  "geofence_alerts": [
    {
      "zone_id": 2,
      "name": "India EEZ (AP Coast segment)",
      "zone_type": "eez",
      "distance_km": 5.14,
      "is_inside": false,
      "message": "You are 5.14km from the India EEZ (AP Coast segment) boundary"
    }
  ],
  "weather_alerts": []
}
```

---

## 7. GET /health

Liveness probe for infrastructure monitoring.

```
GET /health
```

**Response:** `{ "status": "ok" }`

---

## 8. Frontend Integration Notes

### Chat UI — `POST /api/query`

- Always pass `lat`/`lon` before sending — browser geolocation or manual entry
- Display `final_response` as the primary message bubble
- Colour-code by `verdict`: `"safe"` → green, `"caution"` → amber, `"unsafe"` → red, `null` → neutral/grey
- Show `alerts_count > 0` as a badge; if `highest_severity == "high"` flash or pulse it
- `evidence` → collapsible "Sources" section; `source` field is the label, `description` is the content
- `generated_at` → display as "Updated HH:MM"
- `visualization_available: true` → show "View on map" button that calls `/debug/map-payload`

### Map View — `GET /debug/map-payload`

- Feed the full FeatureCollection to Leaflet/MapLibre as a single `geojson` source
- Filter features client-side using `feature.properties.layer`:
  - `"user_location"` → blue pulsing dot
  - `"pfz_advisory"` → fish icon; colour nearest bright, others dimmer; popup shows `advisory_text` + `sst_value`
  - `"eez_boundary"` → dashed stroke `#0077be`, fill `rgba(0,119,190,0.08)`
- Refresh on every new query response (call map-payload after each `/api/query` 200)

### Conditions Card — `GET /debug/risk`

- `weather_snapshot.wave_height` → wave icon + number
- `weather_snapshot.wind_speed` + `wind_direction` → wind compass card
- `weather_snapshot.sea_surface_temp` → SST chip
- `boundary_alerts[0].distance_km` → "X.Xkm from EEZ" warning strip (show if < 20km)

### Language

- Queries in Telugu/Hindi/English are auto-detected; `final_response` is in the same language
- No frontend locale switching needed

### Known Limitations at This Handoff

| Issue | Impact |
|-------|--------|
| `chlorophyll_value` always `null` | INCOIS data feed gap; hide this field in UI |
| PFZ `forecast_date` lags by days | INCOIS advisory cadence; label as "latest advisory" not "today" |
| `/debug/*` routes are open | Gate behind auth or remove before production |
| LLM model is `gemini-flash-lite-latest` (free tier) | 250 req/day limit; cache hits reduce this significantly |

---

## Appendix A — Map Payload Additional Layers

The `/debug/map-payload` response includes two additional layers not covered above:

### `alert` feature (geofence warning point)

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [83.2185, 17.6868] },
  "properties": {
    "layer": "alert",
    "alert_type": "geofence",
    "severity": "medium",
    "message": "You are 5.1km from the Exclusive Economic Zone ('India EEZ (AP Coast segment)')",
    "valid_from": "2026-09-12T09:32:33.248245",
    "valid_upto": "2026-09-12T10:32:33.248245",
    "source": "geospatial_agent",
    "icon": "warning",
    "marker-color": "#FF9800"
  }
}
```

`severity` values: `"low"`, `"medium"`, `"high"`. Use `marker-color` directly as the pin colour.

### `boundary_zone` feature properties (actual field name used in map-payload)

> **Note:** The map-payload endpoint uses `"layer": "boundary_zone"` (not `"eez_boundary"` as described above). The EEZ contract section above describes the conceptual layer; below is the real properties object:

```json
{
  "layer": "boundary_zone",
  "zone_id": 2,
  "zone_type": "eez",
  "name": "India EEZ (AP Coast segment)",
  "distance_km": 5.14,
  "stroke": "#2196F3",
  "stroke-width": 2,
  "fill-opacity": 0.15
}
```

Use `stroke`, `stroke-width`, and `fill-opacity` directly as style hints for MapLibre/Leaflet.

### `metadata` envelope

The FeatureCollection also has a top-level `metadata` field:

```json
{
  "center": [83.2185, 17.6868],
  "generated_at": "2026-09-12T09:32:33.259586",
  "layers": {
    "pfz": 7,
    "boundaries": 1,
    "hazards": 1
  },
  "feature_count": 10
}
```

---

## Appendix B — GET /debug/nearest-stations

Raw coastal station list ordered by distance. Not typically needed by the chat UI but useful for the map's station layer.

```
GET /debug/nearest-stations?lat=17.6868&lon=83.2185
```

**Example response:**
```json
[
  { "station_id": 8, "name": "Visakhapatnam", "station_type": "harbor", "latitude": 17.6868, "longitude": 83.2185, "distance_km": 0.0 },
  { "station_id": 9, "name": "Bheemunipatnam", "station_type": "harbor", "latitude": 17.89, "longitude": 83.43, "distance_km": 31.76 },
  { "station_id": 10, "name": "Srikakulam (Calingapatnam)", "station_type": "harbor", "latitude": 18.28, "longitude": 84.03, "distance_km": 108.16 },
  { "station_id": 6, "name": "Uppada", "station_type": "harbor", "latitude": 17.08, "longitude": 82.32, "distance_km": 116.73 },
  { "station_id": 5, "name": "Kakinada", "station_type": "harbor", "latitude": 16.94, "longitude": 82.235, "distance_km": 133.28 }
]
```
