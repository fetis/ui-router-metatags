namespace uiroutermetatags {
	const appModule = angular.module('ui.router.metatags', ['ui.router']);

	class UIRouterMetatags implements angular.IServiceProvider, uiroutermetatags.IProvider {
		prefix: string = '';
		suffix: string = '';
		defaultTitle: string = '';

		/* @ngInject */
		constructor() {

		}

		setTitlePrefix(prefix: string): void {
			this.prefix = prefix;
		}

		setTitleSuffix(suffix: string): void {
			this.suffix = suffix;
		}

		setDefaultTitle(title: string): void {
			this.defaultTitle = title;
		}

		public $get(): uiroutermetatags.IService {
			return {
				prefix: this.prefix,
				suffix: this.suffix,
				defaultTitle: this.defaultTitle
			}
		}
	}

	appModule.provider('UIRouterMetatags', UIRouterMetatags);

	export class MetaTags {
		title: string;
		keywords: string;
		description: string;
		properties: {};
		
		/* @ngInject */
		constructor(public UIRouterMetatags: uiroutermetatags.IService) {

		}

		update(tags: uiroutermetatags.IMetaTags) {
			if (tags) {
				this.title = tags.title ? this.UIRouterMetatags.prefix + (tags.title || '') + this.UIRouterMetatags.suffix : this.UIRouterMetatags.defaultTitle;
				this.description = tags.description || '';
				this.keywords = tags.keywords || '';
				this.properties = tags.properties || {};
			} else {
				this.title = this.UIRouterMetatags.defaultTitle;
				this.description = '';
				this.keywords = '';
				this.properties = {};
			}
		}
	}

	appModule.service('MetaTags', MetaTags);
	
	/* @ngInject */
	function runBlock($log: angular.ILogService, $rootScope: any, $state: any, MetaTags: uiroutermetatags.MetaTags) {
		$rootScope.MetaTags = MetaTags;

		$rootScope.$on("$stateChangeSuccess", function() {
			if (!$state.current.metaTags) {
				$log.debug(`MetaTags - route: "${$state.current.name}" does not contain any metatags`);
			}
			MetaTags.update($state.current.metaTags);
		});
	}

	appModule.run(runBlock);

}