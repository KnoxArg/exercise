(function () {
	'use strict';

	var byId = function (id) { return document.getElementById(id); };
	var myList = {};
	// Editable list
	var editableList = Sortable.create(byId('editable'), {
		animation: 150,
		group: "mySortableList",
		filter: '.js-remove .js-edit',
		onFilter: function (evt) {
			if (Sortable.utils.is(ctrl, ".js-remove")) {  // Click on remove button
				evt.item.parentNode.removeChild(item); // remove sortable item
			}
			else if (Sortable.utils.is(ctrl, ".js-edit")) {  // Click on edit link
				// ...
			}
		},
		onEnd: function (evt){
			this.save();
		},
		store: {
			/**
			 * Get the order of elements. Called once during initialization.
			 * @param   {Sortable}  sortable
			 * @returns {Array}
			 */
			get: function (sortable) {
				var order = localStorage.getItem(sortable.options.group.name);
				return order ? order.split('|') : [];
			},
	
			/**
			 * Save the order of elements. Called onEnd (when the item is dropped).
			 * @param {Sortable}  sortable
			 */
			set: function (sortable) {
				var order = sortable.toArray();
				localStorage.setItem(sortable.options.group.name, order.join('|'));
			}
		}
	});


	byId('addUser').onclick = function () {
		Ply.dialog('prompt', {
			title: 'Add',
			form: { name: 'name' }
		}).done(function (ui) {
			var li = document.createElement('li');				// create list element
			var uuid = Date.now();								// create unique identifier
			var att = document.createAttribute("data-id");      // Create a "data-id" attribute
			att.value = uuid;               					// Set the id
			li.setAttributeNode(att);       					// set the aatribute to the li element
			li.innerHTML = ui.data.name + '<i class="js-edit">✏️</i><i class="js-remove">✖</i>';
			myList
			editableList.el.appendChild(li);
		});
	};
})();