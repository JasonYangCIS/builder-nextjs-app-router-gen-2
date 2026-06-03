// Next.js instrumentation hook — runs once when a server instance boots, in a
// server-only context (never bundled for the client/edge). We use it to
// initialize Builder's Node runtime, which imports `isolated-vm` so the SDK can
// safely evaluate dynamic data bindings (e.g. state actions on custom
// components) during server render and static generation.
//
// Without this, server-rendered Builder content with bindings throws:
//   "[Builder.io]: could not import `isolated-vm` module for safe script execution"
//
// NEXT_RUNTIME is framework-provided (not app config), so it's read here rather
// than via config.envs. isolated-vm is Node-only, so we guard on the runtime to
// avoid importing it in the edge runtime.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeNodeRuntime } = await import(
      "@builder.io/sdk-react/node/init"
    );
    initializeNodeRuntime();
  }
}
