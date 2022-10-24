
window.$j = window.jQuery = jQuery;

$j( document ).ready(function(){
	var imgDir = $j('.portfolio').data('imgDir')
	var perPage = $j('.portfolio').data('perPage')
	var page = 1;
	var sortType = 'chronological'
	var sortDir = 'DESC'
	var showButton = true
	var cache = {}

	$j('.load-more').bind('click', null, loadMore)

	$j('.portfolio-header__reorder-button').click(reorder);

	// initialize cache with the current projects


	// page loading

	function fetchPage(){
		if(!checkCache()){
			$j.get(
				ajaxData.ajaxUrl,
				{
					'action': 'load_more_projects',
					'posts_per_page': perPage,
					'paged': page,
					'sort_type': sortType,
					'sort_order': sortDir,
					'taxonomy': ajaxData.taxonomy,
					'slug': ajaxData.slug,
				},
				// on success:
				function(response){
					var projects = response.data.projects
					if(response.data.showButton === false){
						showButton = false;
					}
					checkLoadMoreButton()
					changeLoadMoreCount(response.data.buttonNumber)
					addToCache(projects)


					$j('.portfolio-gallery').append($j(projects))

				},
				'json'
			)
		}
	}

	function reorder(e) {
		var newSortType = ''
		$button = $j(e.target)
		page = 0
		switch ($button.data('sortType')) {
			case 'chronological':
				newSortType = 'chronological'
				break;
			case 'alphabetical':
				newSortType = 'alphabetical'
				break;
			default:
				return
		}

		if(sortType == newSortType) {
			if(sortDir == 'DESC'){
				sortDir = 'ASC'
			} else {
				sortDir = 'DESC'
			}
		} else {
			sortDir = 'DESC'
		}

		sortType = newSortType;
		changeButtons($button)
		$j('.portfolio-gallery').empty()
		loadMore()
	}


	// visual changes

	function loadMore(){
		showButton = true
		page++
		fetchPage()

	}

	function checkLoadMoreButton(){
		if(showButton){

			$j('button.load-more').show()
		} else {

			$j('button.load-more').hide()
		}
	}

	function changeLoadMoreCount(number){
		$j('button.load-more').text('Load '+number+' More')
	}
	function changeButtons($button){
		$j('.portfolio-header__reorder-button').removeClass('portfolio-header__reorder-button--selected')
		$j('.portfolio-header__reorder-img').remove()
		$button.addClass('portfolio-header__reorder-button--selected')
		var img = sortDir=='DESC' ? 'down' : 'up';
		var fullImgUrl = imgDir+'img/sort-arrow-'+img+'.png'
		$button.before('<img src="'+fullImgUrl+'" alt="descending order" class="portfolio-header__reorder-img">')
	}


	// cache functions

	function checkCache(){
		if(cache[getCacheString()]){

			$j('.portfolio-gallery').append($j(cache[getCacheString()].projects))
			showButton = cache[getCacheString()]['showButton']
			checkLoadMoreButton()

			return true;
		}
		return false;
	}

	function addToCache(newProjects){
		cache[getCacheString()] = {}
		cache[getCacheString()].projects = newProjects;
		cache[getCacheString()]['showButton'] = showButton;
	}

	function getCacheString(){
		var hash;
		hash = sortType+'_'+sortDir+'_'+page;
		return hash;
	}

})
