import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
} from "@refinedev/mantine";

import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { dataProvider, liveProvider } from "@refinedev/appwrite";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { appwriteClient } from "./utility";

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const { t, i18n } = useTranslation();

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          {/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
          <MantineProvider
            theme={{ ...RefineThemes.Blue, colorScheme: colorScheme }}
            withNormalizeCSS
            withGlobalStyles
          >
            <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
            <NotificationsProvider position="top-right">
              <DevtoolsProvider>
                <Refine
                  dataProvider={dataProvider(appwriteClient, {
                    databaseId: "database",
                  })}
                  liveProvider={liveProvider(appwriteClient, {
                    databaseId: "database",
                  })}
                  authProvider={authProvider}
                  notificationProvider={notificationProvider}
                  i18nProvider={i18nProvider}
                  routerProvider={routerBindings}
                  resources={[
                    {
                      name: "blog_posts",
                      list: "/blog-posts",
                      create: "/blog-posts/create",
                      edit: "/blog-posts/edit/:id",
                      show: "/blog-posts/show/:id",
                      meta: {
                        canDelete: true,
                      },
                    },
                    {
                      name: "categories",
                      list: "/categories",
                      create: "/categories/create",
                      edit: "/categories/edit/:id",
                      show: "/categories/show/:id",
                      meta: {
                        canDelete: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "I2lKdX-uCgs6c-AAfoPY",
                  }}
                >
                  <Routes>
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-inner"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2
                            Header={() => <Header sticky />}
                            Title={({ collapsed }) => (
                              <ThemedTitleV2
                                collapsed={collapsed}
                                text="Refine Project"
                                icon={<AppIcon />}
                              />
                            )}
                          >
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="blog_posts" />}
                      />
                      <Route path="/blog-posts">
                        <Route index element={<BlogPostList />} />
                        <Route path="create" element={<BlogPostCreate />} />
                        <Route path="edit/:id" element={<BlogPostEdit />} />
                        <Route path="show/:id" element={<BlogPostShow />} />
                      </Route>
                      <Route path="/categories">
                        <Route index element={<CategoryList />} />
                        <Route path="create" element={<CategoryCreate />} />
                        <Route path="edit/:id" element={<CategoryEdit />} />
                        <Route path="show/:id" element={<CategoryShow />} />
                      </Route>
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-outer"
                          fallback={<Outlet />}
                        >
                          <NavigateToResource />
                        </Authenticated>
                      }
                    >
                      <Route
                        path="/login"
                        element={
                          <AuthPage
                            type="login"
                            title={
                              <ThemedTitleV2
                                collapsed={false}
                                text="Refine Project"
                                icon={<AppIcon />}
                              />
                            }
                            formProps={{
                              initialValues: {
                                email: "demo@refine.dev",
                                password: "demodemo",
                              },
                            }}
                          />
                        }
                      />
                      <Route
                        path="/register"
                        element={<AuthPage type="register" />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<AuthPage type="forgotPassword" />}
                      />
                    </Route>
                  </Routes>

                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
                <DevtoolsPanel />
              </DevtoolsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
