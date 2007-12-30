window.addEvent('domready', function(){
			var list = $$('#menu ul li');
			list.each(function(element) {
				
				var fx = new Fx.Styles(element, {duration:400, wait:false});
				var fx2 = new Fx.Styles(element.getElement('a'), {duration:400, wait:false});
				
				element.addEvent('mouseenter', function(){
					fx.start({
						'background-color': '#BABDB6',
					});
					fx2.start({
						'color': '#FFFFFF',
					});
				});
				
				element.addEvent('mouseleave', function(){
					fx.start({
						'background-color': '#F2F2F2',
					});
					fx2.start({
						'color': '#3E3E3E',
					});
				});
				
			});
		});