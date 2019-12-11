/*jshint
	module: true,
	esversion: 9
*/

import SubDate from './SubDate.js';
import extend from './Util.js';

export default function MD(input,params){
	const self = this;
	let time = input.value;
	return self.init(input, time, params);
};

MD.SubDate = SubDate;

Object.assign(MD.prototype, {

	init(input, time, params){
		const self = this;
		self.params = extend({}, params);
		self.input = input;
		self.ts = new SubDate(time);
		self.list_attr = {
			y: {get:'getFullYear',set:'addYear'},
			m: {get:'getMyMount',set:'addMonth'},
			d: {get:'getDate',set:'addDays'},
			h: {get:'getHours',set:'addHours'},
			i: {get:'getMinutes',set:'addMinutes'}
		};
		if(params.type && params.type == 'date'){
			delete self.list_attr.h;
			delete self.list_attr.i;
		}else if(params.type && params.type == 'time'){
			delete self.list_attr.y;
			delete self.list_attr.m;
			delete self.list_attr.d;
		}
		self.createDOM();
		self.list_dom = {};
		Object.keys(self.list_attr).forEach(function(v){
			self.list_dom[v] = self.element.querySelectorAll('.e[data-id="'+v+'"] .val')[0];
		});
		self.eventsListner();
		return self;
	},
	
	eventsListner(){
		const self = this;
		self.element.addEventListener('click', function(event){
			var t = event.target;
			var p = function(e){return event.target.parentNode.getAttribute('data-id');};
			if (t.classList.contains('up')) {
				self.update(p(event),1);
			}else if(t.classList.contains('down')){
				self.update(p(event),-1);
			} return;
		}, false);
		function scrolled(e) {
			var p = e.target.parentNode;
			if(p.classList.contains('e')) {
				e.preventDefault();
				var d = e.wheelDelta>0?1:-1;
				self.update(p.getAttribute('data-id'),d);
			}
		};
		self.element.addEventListener('mousewheel', scrolled, { passive: false });
		self.element.addEventListener('DOMMouseScroll', scrolled, { passive: false });
		return self;
	},

	highlight(element){
		element.classList.remove("highlight");
		void element.offsetWidth;
		element.classList.add("highlight");
	},

	update(attr, indice){
		const self = this;
		self.ts[self.list_attr[attr].set](indice);
		return self.view();
	},

	view(){
		const self = this;
		Object.keys(self.list_attr).forEach((v) => {
			self.list_dom[v].innerHTML = self.ts[self.list_attr[v]['get']]();
		});
		self.input.value = self.ts.to_str(self.params && self.params.pattern);
		return self;
	},

	createDOM(){
		var self = this;
		var yjsdate = document.createElement("div");
		yjsdate.classList.add("yjsdate");
		yjsdate.classList.add("clearfix");
		Object.keys(self.list_attr).forEach(function(v){
			var e = document.createElement("div");
			e.className = "e";
			e.setAttribute('data-id',v);
			var u = document.createElement("div");
			u.className = "up";
			u.innerHTML = "+";
			e.appendChild(u);
			var v = document.createElement("div");
			v.className = "val";
			e.appendChild(v);
			var d = document.createElement("div");
			d.className = "down";
			d.innerHTML = "-";
			e.appendChild(d);
			yjsdate.appendChild(e);
		});
		self.input.parentNode.insertBefore(yjsdate, self.input.nextSibling);
		// self.input.style.display = "none";
		self.element = yjsdate;
		return self;
	},

});
