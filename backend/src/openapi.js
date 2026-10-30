const obj = (properties) => ({ type: "object", properties });
const num = { type: "number" };
const json = (schema) => ({ content: { "application/json": { schema } } });
const inputs = obj({
  kwh: num,
  gridFactor: num,
  diet: { type: "string", enum: ["vegan", "vegetarian", "pescatarian", "mixed", "meat_heavy"] },
  km: obj({ car: num, bike: num, bus: num, rail: num, flight: num }),
  lpgKg: num,
  wasteKg: num,
});
const ok = { 200: { description: "OK" } };
const auth = [{ cookieAuth: [] }];

export default {
  openapi: "3.0.3",
  info: {
    title: "Ecometrics API",
    version: "1.0.0",
    description:
      "Carbon footprint calculation & tracking. Protected routes use the Better Auth session cookie from the frontend.",
  },
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "better-auth.session_token" },
    },
  },
  paths: {
    "/api/benchmarks": { get: { summary: "Benchmarks with source/year/units", responses: ok } },
    "/api/calculate": {
      post: {
        summary: "Calculate footprint (stateless)",
        requestBody: json(inputs),
        responses: ok,
      },
    },
    "/api/footprints": {
      get: { summary: "List my saved footprints", security: auth, responses: ok },
      post: {
        summary: "Calculate and save/overwrite a month",
        security: auth,
        requestBody: json({
          allOf: [inputs, obj({ month: { type: "string", example: "2026-10" } })],
        }),
        responses: ok,
      },
    },
    "/api/footprints/{id}": {
      delete: {
        summary: "Delete a saved footprint",
        security: auth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: ok,
      },
    },
  },
};
