import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

export default {
	name: "floating-new-topic-button",

	initialize() {
		withPluginApi("1.0.0", (api) => {
			const currentUser = api.getCurrentUser();
			
			// Only show for logged-in users
			if (!currentUser) return;

			api.onPageChange(() => {
				// Remove existing button if any
				const existingBtn = document.querySelector(".floating-new-topic-btn");
				if (existingBtn) return; // Already exists

				// Create the button
				const btn = document.createElement("button");
				btn.className = "floating-new-topic-btn";
				btn.title = "New Topic";
				btn.innerHTML = iconHTML("plus");

				btn.addEventListener("click", () => {
					const composer = api.container.lookup("service:composer");
					const router = api.container.lookup("service:router");
					
					// Try to get the current category from the route
					let category = null;
					
					// Check if we're on a category page
					const routeName = router.currentRouteName;
					if (routeName && routeName.startsWith("discovery.")) {
						const currentRoute = router.currentRoute;
						
						// Try to get category from route attributes
						if (currentRoute?.attributes?.category) {
							category = currentRoute.attributes.category;
						}
					}
					
					// Also try getting from the controller
					if (!category) {
						try {
							const discoveryController = api.container.lookup("controller:discovery");
							if (discoveryController?.category) {
								category = discoveryController.category;
							}
						} catch (e) {
							// Controller might not exist
						}
					}

					// Also check navigation-category-controller
					if (!category) {
						try {
							const navController = api.container.lookup("controller:navigation/category");
							if (navController?.category) {
								category = navController.category;
							}
						} catch (e) {
							// Controller might not exist
						}
					}

					if (category) {
						composer.openNewTopic({
							category: category,
							categoryId: category.id
						});
					} else {
						composer.openNewTopic();
					}
				});

				document.body.appendChild(btn);
			});
		});
	},
};
