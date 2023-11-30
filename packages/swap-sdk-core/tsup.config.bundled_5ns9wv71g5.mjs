// tsup.config.ts
import { defineConfig } from "tsup";
import { exec } from "child_process";
var tsup_config_default = defineConfig((options) => ({
  entry: {
    index: "./src/index.ts"
  },
  format: ["esm", "cjs"],
  dts: false,
  treeshake: true,
  splitting: true,
  clean: !options.watch,
  onSuccess: async () => {
    exec("tsc --emitDeclarationOnly --declaration", (err) => {
      if (err) {
        console.error(err);
        if (!options.watch) {
          process.exit(1);
        }
      }
    });
  }
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdGV0ZXZpL3BheTgvcGFja2FnZXMvc3dhcC1zZGstY29yZS90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS90ZXRldmkvcGF5OC9wYWNrYWdlcy9zd2FwLXNkay1jb3JlXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3RldGV2aS9wYXk4L3BhY2thZ2VzL3N3YXAtc2RrLWNvcmUvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygob3B0aW9ucykgPT4gKHtcbiAgZW50cnk6IHtcbiAgICBpbmRleDogJy4vc3JjL2luZGV4LnRzJyxcbiAgfSxcbiAgZm9ybWF0OiBbJ2VzbScsICdjanMnXSxcbiAgZHRzOiBmYWxzZSxcbiAgdHJlZXNoYWtlOiB0cnVlLFxuICBzcGxpdHRpbmc6IHRydWUsXG4gIGNsZWFuOiAhb3B0aW9ucy53YXRjaCxcbiAgb25TdWNjZXNzOiBhc3luYyAoKSA9PiB7XG4gICAgZXhlYygndHNjIC0tZW1pdERlY2xhcmF0aW9uT25seSAtLWRlY2xhcmF0aW9uJywgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgaWYgKCFvcHRpb25zLndhdGNoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxufSkpXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsb0JBQW9CO0FBQ25TLFNBQVMsWUFBWTtBQUVyQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxhQUFhO0FBQUEsRUFDeEMsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxFQUNyQixLQUFLO0FBQUEsRUFDTCxXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsRUFDWCxPQUFPLENBQUMsUUFBUTtBQUFBLEVBQ2hCLFdBQVcsWUFBWTtBQUNyQixTQUFLLDJDQUEyQyxDQUFDLFFBQVE7QUFDdkQsVUFBSSxLQUFLO0FBQ1AsZ0JBQVEsTUFBTSxHQUFHO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLE9BQU87QUFDbEIsa0JBQVEsS0FBSyxDQUFDO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
