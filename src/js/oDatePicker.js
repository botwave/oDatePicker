/**
 * oDatePicker
 * version: 0.0.8 beta
 * author: nino zhang
 * email: ninozhang@foxmail.com
 * last update: 2011/7/6
 * https://github.com/ninozhang/oDatePicker
 */

(function ($) {

var win = window,
	doc = window.document,
	
	SUNDAY = 0,
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	
	prefix = 'odp',
	
	START = 'start',
	END = 'end',
	ENABLE_COMPARE = 'enableCompare',
	COMPARE_START = 'compareStart',
	COMPARE_END = 'compareEnd',
	
	ALIGN_LEFT = 'left',
	ALIGN_RIGHT = 'right',
	
	RANGE_CUSTOM = 'custom',
	RANGE_TODAY = 'today',
	RANGE_YESTERDAY = 'yesterday',
	RANGE_THIS_WEEK = 'thisweek',
	RANGE_LAST_WEEK = 'lastweek',
	RANGE_THIS_MONTH = 'thismonth',
	RANGE_LAST_MONTH = 'lastmonth',
	
	UNIT_AUTO = 'auto',
	UNIT_HOUR = 'hour',
	UNIT_DAY = 'day',
	UNIT_WEEK = 'week',
	UNIT_MONTH = 'month',
	UNIT_SEASON = 'season',
	UNIT_YEAR = 'year',
	
	CAL_DATE_DISABLE_CLASS_NAME = 'odp_ctrl_cal_date_disable';
	START_INPUT_CLASS_NAME = 'odp_ctrl_start',
	END_INPUT_CLASS_NAME = 'odp_ctrl_end',
	COMPARE_START_INPUT_CLASS_NAME = 'odp_ctrl_compare_start',
	COMPARE_END_INPUT_CLASS_NAME = 'odp_ctrl_compare_end',
	DATE_INPUT_CLASS_NAME = [START_INPUT_CLASS_NAME, END_INPUT_CLASS_NAME, COMPARE_START_INPUT_CLASS_NAME, COMPARE_END_INPUT_CLASS_NAME],
	
	EN = {
		comma: ',',
		apply: 'Apply',
		reset: 'Reset',
		compareWith: 'Compare With:',
		rangeLabel: 'Date Range:',
		compareLabel: 'Compare With',
		range: {custom: 'Custom', today: 'Today', yesterday: 'Yesterday', thisweek: 'This Week', lastweek: 'Last Week', thismonth: 'This Month', lastmonth: 'Last Month'},
		unitLabel: 'Unit:',
		unit: {auto: 'Auto', hour: 'Hour', day: 'Day', week: 'Week', month: 'Month', season: 'Season', year: 'Year'},
		days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	},
	ZHCN = {
		comma: '，',
		apply: '应用',
		reset: '重置',
		compareWith: '相较于：',
		rangeLabel: '日期范围：',
		compareLabel: '与其它时间比较',
		range: {custom: '自定义', today: '今天', yesterday: '昨天', thisweek: '本周', lastweek: '上周', thismonth: '本月', lastmonth: '上个月'},
		unitLabel: '单位：',
		unit: {auto: '自动', hour: '小时', day: '天', week: '周', month: '月', season: '季度', year: '年'},
		days: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
		daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
		daysMin: ['日', '一', '二', '三', '四', '五', '六', '日'],
		months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
	},
	ZHTW = {
		comma: '，',
		apply: '應用',
		reset: '重置',
		compareWith: '相較於：',
		rangeLabel: '日期範圍：',
		compareLabel: '與其他時間比較',
		range: {custom: '自定義', today: '今天', yesterday: '昨天', thisweek: '本週', lastweek: '上週', thismonth: '本月', lastmonth: '上個月'},
		unitLabel: '單位：',
		unit: {auto: '自動', hour: '小時', day: '天', week: '週', month: '月', season: '季度', year: '年'},
		days: ['星期一', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
		daysShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六', '週日'],
		daysMin: ['日', '一', '二', '三', '四', '五', '六', '日'],
		months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
	};

var DateCellModel = Backbone.Model.extend({
	defaults: {
		id: null,
		date: null,
		dayOfWeek: 0,
		isToday: false,
		display: true,
		disable: false,
		noRange: true,
		inRange: false,
		compareRange: false,
		bothRange: false
	},
	initialize: function() {
		var date = this.get('date'),
			now = new Date();
		if(date) {
			var isToday = false;
			if(date.getFullYear() == now.getFullYear() 
				&& date.getMonth() == now.getMonth() 
				&& date.getDate() == now.getDate()) {
				isToday = true;
			}
			this.set({year: date.getFullYear(), 
					  month: date.getMonth() + 1,
					  day: date.getDate(),
					  dayOfWeek: date.getDay(),
					  isToday: isToday});
		}
		if(!this.get('id')) {
			var id = prefix + '_' + this.get('year') + '_' + this.get('month') + '_' + this.get('day');
			this.set({'id': id}, {silent: true});
		}
	},
	change: function() {
		if(this.get('inRange') && this.get('compareRange')) {
			this.set({inRange: false, compareRange: false, bothRange: true}, {silent: true});
		} else {
			this.set({bothRange: false}, {silent: true});
		}
		if(!this.get('inRange') && !this.get('compareRange') && !this.get('bothRange')) {
			this.set({noRange: true}, {silent: true});
		}
	}
});

var DateCell = Backbone.View.extend({
	tagName: 'td',
	className: 'odp_ctrl_cal_date',
	initialize: function() {
		this.render();
	},
	render: function() {
		var cell = $(this.el),
			isToday = this.model.get('isToday'),
			display = this.model.get('display'),
			noRange = this.model.get('noRange'),
			inRange = this.model.get('inRange'),
			compareRange = this.model.get('compareRange'),
			bothRange = this.model.get('bothRange'),
			disable = this.model.get('disable');
		if(isToday) {
			cell.addClass('odp_ctrl_cal_date_today');
		}
		if(display) {
			cell.text(this.model.get('day'));
		}
		if(noRange) {
			cell.addClass('odp_ctrl_cal_date_no_range');
		}
		if(inRange) {
			cell.addClass('odp_ctrl_cal_date_in_range');
		}
		if(compareRange) {
			cell.addClass('odp_ctrl_cal_date_compare_range');
		}
		if(bothRange) {
			cell.addClass('odp_ctrl_cal_date_both_range');
		}
		if(disable) {
			cell.addClass('odp_ctrl_cal_date_disable');
		}
		if(inRange && disable) {
			cell.addClass('odp_ctrl_cal_date_in_range_disable');
		}
		if(compareRange && disable) {
			cell.addClass('odp_ctrl_cal_date_compare_range_disable');
		}
		if(bothRange && disable) {
			cell.addClass('odp_ctrl_cal_date_both_range_disable');
		}
		cell.attr('id', this.model.get('id'));
		return this;
	},
	enable: function() {
		$(this.el).removeClass('odp_ctrl_cal_date_disable');
	},
	disable: function() {
		$(this.el).addClass('odp_ctrl_cal_date_disable');
	}
});

var CalendarModel = Backbone.Model.extend({
	defaults: {
		control: null,
		id: null,
		parent: null,
		date: null,
		year: 0,
		month: 0,
		day: 0,
		startOfWeek: SUNDAY,
		locale: null
	},
	initialize: function() {
		var date = this.get('date');
		var year = this.get('year');
		var month = this.get('month');
		if(!date) {
			date = new Date();
			date.setHours(0, 0, 0, 0);
			date.setDate(1);
			if(year != 0 && month != 0) {
				date.setFullYear(year);
				date.setMonth(month-1);
			}
		}
		year = date.getFullYear();
		month = date.getMonth() + 1;
		this.set({date: date, year: year, month: month});
	}
});

var Calendar = Backbone.View.extend({
	tagName: 'table',
	className: 'odp_ctrl_cal_table',
	initialize: function() {
		this.render();
	},
	render: function() {
		var locale = this.model.get('locale'),
			date = this.model.get('date'),
			year = date.getFullYear(),
			month = date.getMonth(),
			startOfWeek = this.model.get('startOfWeek'),
			now = new Date(),
			control = this.model.get('control'),
			start = control.getStart(),
			end = control.getEnd(),
			compareStart = control.getCompareStart(),
			compareEnd = control.getCompareEnd();
		
		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);
		
		$(this.el).attr('cellspacing', 0)
				  .attr('cellpadding', 0);
		var head = $('<thead>' +
		  '<tr>' +
		    '<td colspan="7" class="odp_dctrl_cal_head"><button>' + locale.months[(month % 12)] + ' ' + year + '</button></td>' +
		  '</tr>' +
		'</thead>');
		$(this.el).append(head);
		
		var days = $('<tr></tr>');
		var count = 0;
		var index = startOfWeek;
		while(count < 7) {
			days.append('<th class="odp_ctrl_cal_day">' + locale.daysMin[(index % 7)] + '</th>');
			index++;
			count++;
		}
		$(this.el).append(days);
		
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(1);
		date.setFullYear(year);
		date.setMonth(month);
		var day = date.getDay();
		if(day != startOfWeek) {
			var daysBefore = day - startOfWeek - 1;
			if(daysBefore < 0) {
				daysBefore = daysBefore + 7;
			}
			daysBefore %= 6;
			date.setDate(-daysBefore);
		}
		var row = 0;
		while(row < 6) {
			var dateCells = $('<tr></tr>');
			var column = 0;
			while(column < 7) {
				var disable = this.isDisable(date, month);
				var inRange = this.inRange(date, start, end);
				var compareRange = this.inRange(date, compareStart, compareEnd);
				var dateCellModel = new DateCellModel({date: date, inRange: inRange, compareRange: compareRange, disable: disable});
				var dateCell = new DateCell({model: dateCellModel});
				dateCells.append(dateCell.el);
				date.setDate(date.getDate() + 1);
				column++;
			}
			$(this.el).append(dateCells);
			row++;
			if(date.getFullYear() != year || date.getMonth() > month) {
				break;
			}
		}
		
		return this;
	},
	isDisable: function(date, month) {
		var isFuture = this.isFuture(date);
		if(date.getMonth() != month || isFuture) {
			 return true;
		}
		return false;
	},
	isFuture: function(date) {
		var today = new Date();
		today.setHours(23, 59, 59, 999);
		return (date > today);
	},
	inRange: function(date, start, end) {
		if(start && 
			((date - start == 0) || (date - start > 0 && end && date - end <= 0))) {
			return true;
		}
		return false;
	}
});

var ControlModel = Backbone.Model.extend({
	defaults: {
		odp: null,
    	calendars: 2,
	    dates: [],
	    locale: ZHCN,
	    startOfWeek: SUNDAY,
	    showCompare: true,
	    renew: true,
	    prev: false,
	    next: false,
	    timeIndex: 0,
	    timeName: [START, END, COMPARE_START, COMPARE_END],
	    range: RANGE_CUSTOM,
	    start: null,
	    end: null,
	    showCompare: true,
	    enableCompare: false,
	    compareStart: null,
	    compareEnd: null,
	    unit: UNIT_AUTO,
	    startInput: null,
	    endInput: null,
	    compareStartInput: null,
	    compareEndInput: null,
	    locale: null
	},
	initialize: function() {
		this.calculateDates();
	},
	validate: function(attrs) {
		for (var name in attrs) {
			if(name == 'start' && this.isIllegalTime(attrs.start)) {
				return 'start is illegal.';
			}
			if(name == 'end' && this.isIllegalTime(attrs.end)) {
				return 'end is illegal.';
			}
			if(name == 'enableCompare' && this.isBlank(attrs.enableCompare)) {
				return 'enableCompare is illegal.';
			}
			if(name == 'compareStart' && this.isIllegalTime(attrs.compareStart)) {
				return 'compareStart is illegal.';
			}
			if(name == 'compareEnd' && this.isIllegalTime(attrs.compareEnd)) {
				return 'compareEnd is illegal.';
			}
			if(name == 'unit' && this.isBlank(attrs.unit)) {
				return 'unit is illegal.';
			}
		}
	},
	change: function() {
		if(this.hasChanged('start') 
			|| this.hasChanged('end') 
			|| this.hasChanged('enableCompare')
			|| this.hasChanged('compareStart') 
			|| this.hasChanged('compareEnd') 
			|| this.hasChanged('unit')
			|| this.hasChanged('renew')
			|| this.hasChanged('prev')
			|| this.hasChanged('next')) {
			this.set({needUpdate: true}, {silent: true});
			this.calculateDates();
		}
	},
	calculateDates: function() {
		var index = 0,
			count = this.get('calendars'),
			date = null,
			times = [],
			dates = this.get('dates'),
			renew = this.get('renew'),
			prev = this.get('prev'),
			next = this.get('next');
		
		if(!renew && !prev && !next) {
			return;
		}
		
		if(prev) {
			date = dates.pop();
			if(dates.length > 0) {
				date = new Date(dates[0]);
			}
			date.setMonth(date.getMonth() - 1);
			dates.unshift(date);
		} else if(next) {
			date = dates.shift();
			if(dates.length > 0) {
				date = new Date(dates[dates.length - 1]);
			}
			date.setMonth(date.getMonth() + 1);
			dates.push(date);
		} else if(renew) {
			times.push(this.get('start'));
			times.push(this.get('end'));
			times.push(this.get('compareStart'));
			times.push(this.get('compareEnd'));
			
			for(var i = times.length - 1; i > 0; i--) {
				var time = times[i];
				if(time && (!date || time > date)) {
					date = new Date(time);
				}
			}
			
			if(!date) {
				date = new Date();
			}
			
			date.setDate(1);
			dates = [];
			
			while(index < count) {
				var d = new Date(date);
				var m = d.getMonth() - index;
				d.setMonth(m);
				dates.unshift(d);
				index++;
			}
		}
		this.set({renew: false, prev: false, next: false, dates: dates}, {silent: true});
	},
	startString: function() {
		return this.formatDate(this.get('start'));
	},
	endString: function() {
		return this.formatDate(this.get('end'));
	},
	compareStartString: function() {
		return this.formatDate(this.get('compareStart'));
	},
	compareEndString: function() {
		return this.formatDate(this.get('compareEnd'));
	},
	formatDate: function(date) {
		if(!date) {
			return '';
		}
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		return y + '/' + m + '/' + d;
	},
	isBlank: function(o) {
		return (o === undefined || o == null || String(o).replace(/[\n\r\t]/gi, '') == '');
	},
	isNotBlank: function(o) {
		return !this.isBlank(o);
	},
	isIllegalTime: function(o) {
		return (o === undefined || String(o).replace(/[\n\r\t]/gi, '') == '');
	},
	isLegalTime: function(o) {
		return !this.isIllegalTime(o);
	}
});

var Control = Backbone.View.extend({
	tagName: 'div',
	className: 'odp_ctrl',
	events: {
		'click .odp_ctrl_cal_prev': 'prev',
		'click .odp_ctrl_cal_next': 'next',
		'click .odp_ctrl_cal_date': 'select',
		'click .odp_ctrl_date_input': 'clickInput',
		'click .odp_ctrl_compare_label': 'clickCompareLabel',
		'keyup .odp_ctrl_date_input': 'onInputKeyup',
		'blur .odp_ctrl_date_input': 'onInputBlur',
		'change .odp_ctrl_range_select': 'changeRange',
		'change .odp_ctrl_unit': 'changeUnit',
		'click .odp_ctrl_apply': 'apply',
		'click .odp_ctrl_reset': 'reset'
	},
	initialize: function() {
		var odp = this.model.get('odp');
		odp.setControl(this);
		this.render();
	},
	render: function() {
		var odp = this.model.get('odp'),
			parent = this.model.get('parent'),
			showCompare = this.model.get('showCompare'),
			row = $('<tr></tr>');
		
		$('<td></td>').addClass('odp_valign_top')
					  .addClass('odp_ctrl_cal')
					  .append(this.renderCalendar())
					  .appendTo(row);
		
		$('<td></td>').addClass('odp_valign_top')
					  .addClass('odp_ctrl_set')
					  .append(this.renderSetting())
					  .appendTo(row);
		
		var ctrlTable = $('<table></table>').addClass('odp_valign_top')
											.addClass('odp_ctrl_table')
											.append(row)
											.appendTo(this.el);
		
		$(this.el).hide().appendTo($('body'));
		this.adjustPosition();
		
		var startInput = $(this.el).find('.odp_ctrl_start'),
			endInput = $(this.el).find('.odp_ctrl_end'),
			compareStartInput = $(this.el).find('.odp_ctrl_compare_start'),
			compareEndInput = $(this.el).find('.odp_ctrl_compare_end');
		
		this.showCompare(showCompare);
		this.model.set({startInput: startInput, endInput: endInput, compareStartInput: compareStartInput, compareEndInput: compareEndInput});
		
		this.updateInputVal();
		
		return this;
	},
	renderCalendar: function() {
		var locale = this.model.get('locale'),
			dates = this.model.get('dates'),
			startOfWeek = this.model.get('startOfWeek');
		var prev = $('<td class="odp_valign_top"><div class="odp_ctrl_cal_prev"><div class="odp_ctrl_cal_arrow_left"></div></div></td>');
		var next = $('<td class="odp_valign_top"><div class="odp_ctrl_cal_next"><div class="odp_ctrl_cal_arrow_right"></div></div></td>');
		var row = $('<tr></tr>');
		row.append(prev);
		for(var index = 0; index < dates.length; index++) {
			var model = new CalendarModel({locale: locale, control: this, date: dates[index], startOfWeek: startOfWeek});
			var calendar = new Calendar({model: model});
			$('<td></td>').addClass('odp_valign_top')
						  .append(calendar.el)
						  .appendTo(row);
		}
		row.append(next);
		var table = $('<table></table>').append(row);
		return table;
	},
	renderSetting: function() {
		var locale = this.model.get('locale');
		return $("\
		<div class='odp_ctrl_range_label'>" + locale.rangeLabel + "\
	          <select class='odp_ctrl_range_select'>\
	            <option value='custom'>" + locale.range.custom + "</option>\
	            <option value='today'>" + locale.range.today + "</option>\
	            <option value='yesterday'>" + locale.range.yesterday + "</option>\
	            <option value='thisweek'>" + locale.range.thisweek + "</option>\
	            <option value='lastweek'>" + locale.range.lastweek + "</option>\
	            <option value='thismonth'>" + locale.range.thismonth + "</option>\
	            <option value='lastmonth'>" + locale.range.lastmonth + "</option>\
	          </select>\
	        </div>\
	        <div class='odp_ctrl_range'>\
	          <input type='text' index='0' class='odp_ctrl_date_input odp_ctrl_start odp_ctrl_date_pick' tabIndex=1 readonly />\
	          -\
	          <input type='text' index='1' class='odp_ctrl_date_input odp_ctrl_end' tabIndex=2 readonly />\
	        </div>\
	        <div class='odp_ctrl_compare_label' style='display:none'>\
	          <input type='checkbox' class='odp_ctrl_compare_enable_cb' />\
	          " + locale.compareLabel + "\
	        </div>\
	        <div class='odp_ctrl_compare_range' style='display:none'>\
	          <input type='text' index='2' class='odp_ctrl_date_input odp_ctrl_compare_start' tabIndex=3 readonly />\
	          -\
	          <input type='text' index='3' class='odp_ctrl_date_input odp_ctrl_compare_end' tabIndex=4 readonly />\
	        </div>\
	        <div class='odp_ctrl_unit_label'>" + locale.unitLabel + "\
	          <select class='odp_ctrl_unit'>\
	            <option value='auto'>" + locale.unit.auto + "</option>\
	            <option value='hour'>" + locale.unit.hour + "</option>\
	            <option value='day'>" + locale.unit.day + "</option>\
	            <option value='week'>" + locale.unit.week + "</option>\
	            <option value='month'>" + locale.unit.month + "</option>\
	            <option value='season'>" + locale.unit.season + "</option>\
	            <option value='year'>" + locale.unit.year + "</option>\
	          </select>\
	        </div>\
	        <div class='odp_ctrl_separator'></div>\
	        <div class='odp_ctrl_button'>\
	          <input type='button' class='odp_ctrl_apply' value='" + locale.apply + "' />\
	          <a href='javascript:;' class='odp_ctrl_reset'>" + locale.reset + "</a></div>\
		");
	},
	updateCalendar: function(renew) {
		if(renew == true) {
			this.model.set({renew: true});
		}
		$(this.el).find('.odp_ctrl_cal').empty().append(this.renderCalendar());
		this.updateInputVal();
	},
	adjustPosition: function() {
		var odp = this.model.get('odp'),
			align = odp.getAlign(),
			view = odp.getView(),
			viewTop = view.top(),
			viewLeft = view.left(),
			viewHeight = view.height(),
			viewWidth = view.width(),
			width = $(this.el).width();
			
			if(align == ALIGN_LEFT) {
				$(this.el).addClass('odt_ctrl_top_left_angle')
						  .css('float', 'left')
						  .css('left', viewLeft);
			} else {
				$(this.el).addClass('odt_ctrl_top_right_angle')
						  .css('float', 'right')
						  .css('left', viewWidth - width - 2);
			}
			
			$(this.el).css('top', viewTop + viewHeight - 1)
	},
	prev: function() {
		this.model.set({prev: true});
		this.updateCalendar();
	},
	next: function() {
		this.model.set({next: true});
		this.updateCalendar();
	},
	select: function(event) {
		var target = $(event.target),
			idExp = /(.*)(_)(\d+)(_)(\d+)(_)(\d+)/,
			id = target.attr('id'),
			ids = idExp.exec(id),
			y = ids[3],
			m = ids[5]-1,
			d = ids[7],
			date = new Date(),
			range = this.getRange();
		
		if(range != RANGE_CUSTOM || target.hasClass(CAL_DATE_DISABLE_CLASS_NAME)) {
			return;
		}
		
		date.setFullYear(y, m, d);
		date.setHours(0, 0, 0, 0);
		
		this.setTime(date);
		this.updateCalendar();
	},
	changeUnit: function(event) {
		var select = $(event.target),
			unit = select.val();
		this.model.set({unit: unit});
	},
	changeRange: function() {
		var select = $(this.el).find('.odp_ctrl_range_select'),
			val = select.val(),
			enableCompare = false;
		
		this.setRange(val);
		if(val == RANGE_CUSTOM) {
			this.showRange();
			return;
		}
		switch(val) {
			case RANGE_TODAY:
				this.selectToday();
				break;
			case RANGE_YESTERDAY:
				this.selectYesterday();
				break;
			case RANGE_THIS_WEEK:
				this.selectThisWeek();
				break;
			case RANGE_LAST_WEEK:
				this.selectLastWeek();
				break;
			case RANGE_THIS_MONTH:
				this.selectThisMonth();
				break;
			case RANGE_LAST_MONTH:
				this.selectLastMonth();
				break;
		}
		this.hideRange();
		this.updateCalendar(true);
		this.renewLastCompareRange();
	},
	selectToday: function() {
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		this.setStart(date);
		this.setEnd(date);
	},
	selectYesterday: function() {
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - 1);
		this.setStart(date);
		this.setEnd(date);
	},
	selectThisWeek: function() {
		var date = new Date(),
			startOfWeek = this.model.get('startOfWeek'),
			diff = startOfWeek - date.getDay(),
			start = null,
			end = null;
			
		date.setHours(0, 0, 0, 0);
		
		start = new Date(date);
		start.setDate(start.getDate() + diff);
		this.setStart(start);
		
		end = new Date(date);
		this.setEnd(end);
	},
	selectLastWeek: function() {
		var date = new Date(),
			startOfWeek = this.model.get('startOfWeek'),
			diff = startOfWeek - date.getDay(),
			start = null,
			end = null;
			
		date.setHours(0, 0, 0, 0);
		
		start = new Date(date);
		start.setDate(start.getDate() + diff - 7);
		this.setStart(start);
		
		end = new Date(date);
		end.setDate(date.getDate() + diff - 1);
		this.setEnd(end);
	},
	selectThisMonth: function() {
		var date = new Date(),
			start = null,
			end = null;
			
		date.setHours(0, 0, 0, 0);
		
		start = new Date(date);
		start.setDate(1);
		this.setStart(start);
		
		end = new Date(date);
		this.setEnd(end);
	},
	selectLastMonth: function() {
		var date = new Date(),
			start = null,
			end = null;
			
		date.setHours(0, 0, 0, 0);
		
		start = new Date(date);
		start.setMonth(start.getMonth() - 1);
		start.setDate(1);
		this.setStart(start);
		
		end = new Date(date);
		end.setDate(0);
		this.setEnd(end);
	},
	clickInput: function(event) {
		var input = $(event.target),
			index = Number(input.attr('index'));
		this.setTimeIndex(index);
	},
	onInputKeyup: function(event) {
		var keyCode = event.keyCode,
			input = $(event.target),
			index = input.attr('index');
		input.attr('changed', true);
		if(keyCode == 9) {
			this.onInputBlur(event);
		}
	},
	onInputBlur: function(event) {
		var input = $(event.target),
			changed = input.attr('changed');
			index = input.attr('index'),
			val = input.val(),
			exp = /(\d{2,4})(.|\s)(\d{1,2})(.|\s)(\d{1,2})/,
			fields = [],
			date = null,
			previous = null,
			today = null,
			y = 0,
			m = 0,
			d = 0;
			
		if(Boolean(changed) != true) {
			return;
		}
		if(val == null || val.length == 0) {
			this.updateInputVal();
			return;
		}
		fields = exp.exec(val);
		if(fields == null || fields.length != 6) {
			this.updateInputVal();
			return;
		}
		
		switch(index) {
			case 0:
				previous = this.getStart();
				break;
			case 1:
				previous = this.getEnd();
				break;
			case 2:
				previous = this.getCompareStart();
				break;
			case 3:
				previous = this.getCompareEnd();
				break;
		}
		
		
		date = new Date();
		y = Number(fields[1]);
		m = Number(fields[3]) - 1;
		d = Number(fields[5]);
		date.setFullYear(y, m, d);
		date.setHours(0, 0, 0, 0);
		
		today = new Date();
		today.setHours(0, 0, 0, 0);
		
		if(date > today) {
			date = today;
		}
		
		if(previous != date) {
			this.setTime(date, index);
			this.updateCalendar();
		}
	},
	focusInput: function(input) {
		if(!input) {
			return;
		}
		input = $(input);
		$(this.el).find('.odp_ctrl_date_input')
				  .removeClass('odp_ctrl_date_pick')
				  .removeClass('odp_ctrl_date_compare_pick');
		var index = Number(input.attr('index'));
		if(index < 2) {
			input.addClass('odp_ctrl_date_pick');
		} else {
			input.addClass('odp_ctrl_date_compare_pick');
		}
		input.focus();
	},
	updateInputVal: function() {
		var startString = this.getStartString(),
			endString = this.getEndString(),
			compareStartString = this.getCompareStartString(),
			compareEndString = this.getCompareEndString();
		this.setStartInputVal(startString);
		this.setEndInputVal(endString);
		this.setCompareStartInputVal(compareStartString);
		this.setCompareEndInputVal(compareEndString);
	},
	setStartInputVal: function(text) {
		var input = this.model.get('startInput');
		this.setInputVal(input, text);
	},
	setEndInputVal: function(text) {
		var input = this.model.get('endInput');
		this.setInputVal(input, text);	
	},
	setCompareStartInputVal: function(text) {
		var input = this.model.get('compareStartInput');
		this.setInputVal(input, text);
	},
	setCompareEndInputVal: function(text) {
		var input = this.model.get('compareEndInput');
		this.setInputVal(input, text);
	},
	setInputVal: function(input, text) {
		if(!input) {
			return;
		}
		$(input).val(text);
	},
	clickCompareLabel: function() {
		var enableCompare = this.getEnableCompare();
		this.enableCompare(!enableCompare);
	},
	enableCompare: function(enable) {
		var enableCompare = this.getEnableCompare(),
			cb = $(this.el).find('.odp_ctrl_compare_enable_cb');
		
		if(enableCompare == enable) {
			return;
		}	
		
		if(enable) {
			this.model.set({'enableCompare': enable});
			this.renewLastCompareRange();
			this.showCompareRange();
			cb.attr('checked', true);
		} else {
			this.clearCompareRange();
			this.hideCompareRange();
			cb.removeAttr('checked');
			this.model.set({'enableCompare': enable});
		}
	},
	renewLastCompareRange: function() {
		var enableCompare = this.getEnableCompare(),
			start = this.getStart(),
			end = this.getEnd(),
			diff = (end - start) / (1000 * 60 * 60 * 24) + 1,
			compareStart = null,
			compareEnd = null;
			
		if(!enableCompare) {
			return;
		}
		
		compareStart = new Date(start);
		compareStart.setDate(compareStart.getDate() - diff);
		this.setCompareStart(compareStart);
		
		compareEnd = new Date(start);
		compareEnd.setDate(compareEnd.getDate() - 1);
		this.setCompareEnd(compareEnd);
		this.updateCalendar();
	},
	clearCompareRange: function() {
		this.setCompareStart(null);
		this.setCompareEnd(null);
		this.updateCalendar();
	},
	apply: function() {
		var odp = this.model.get('odp'),
			view = odp.getView(),
			range = this.getRange(),
			start = this.getStart(),
			end = this.getEnd(),
			enableCompare = this.getEnableCompare(),
			compareStart = this.getCompareStart(),
			compareEnd = this.getCompareEnd(),
			unit = this.getUnit();
		
		this.setTimeIndex(0);
		this.hide()
		view.setUnit(unit);
		view.setRange(range);
		view.setStart(start);
		view.setEnd(end);
		view.setCompareStart(compareStart);
		view.setCompareEnd(compareEnd);
		view.setEnableCompare(enableCompare);
		view.render();
	},
	reset: function() {
		var odp = this.model.get('odp'),
			view = odp.getView(),
			start = view.getStart(),
			rangeSelect = $(this.el).find('.odp_ctrl_range_select'),
			range = view.getRange(),
			end = view.getEnd(),
			enableCompare = view.getEnableCompare(),
			compareStart = view.getCompareStart(),
			compareEnd = view.getCompareEnd();
			
		rangeSelect.val(range);
		this.changeRange();
		this.setStart(start);
		this.setEnd(end);
		this.enableCompare(enableCompare);
		this.setCompareStart(compareStart);
		this.setCompareEnd(compareEnd);
		this.updateCalendar();
	},
	showRange: function() {
		$(this.el).find('.odp_ctrl_range').show();
		this.showCompareRange();
	},
	hideRange: function() {
		$(this.el).find('.odp_ctrl_range').hide();
		this.hideCompareRange();
	},
	showCompareRange: function() {
		var showCompare = this.model.get('showCompare'),
			enableCompare = this.model.get('enableCompare'),
			range = this.model.get('range');
		if(showCompare && enableCompare && range == RANGE_CUSTOM) {
			$(this.el).find('.odp_ctrl_compare_range').show();
		} else {
			$(this.el).find('.odp_ctrl_compare_range').hide();
		}
	},
	hideCompareRange: function() {
		$(this.el).find('.odp_ctrl_compare_range').hide();
	},
	showCompare: function(show) {
		var compareRange = $(this.el).find('.odp_ctrl_compare_label');
		if(show) {
			compareRange.show();
		} else {
			compareRange.hide();
			this.enableCompare(false);
		}
	},
	show: function() {
		this.adjustPosition();
		$(this.el).show();
	},
	hide: function() {
		$(this.el).hide();
	},
	setRange: function(range) {
		this.model.set({range: range});
	},
	getRange: function() {
		return this.model.get('range');
	},
	setStart: function(time) {
		this.setTime(time, 0);
	},
	getStart: function() {
		return this.model.get('start');
	},
	getStartString: function() {
		return this.model.startString();
	},
	setEnd: function(time) {
		this.setTime(time, 1);
	},
	getEnd: function() {
		return this.model.get('end');
	},
	getEndString: function() {
		return this.model.endString();
	},
	setCompareStart: function(time) {
		this.setTime(time, 2);
	},
	getCompareStart: function() {
		return this.model.get('compareStart');
	},
	getCompareStartString: function() {
		return this.model.compareStartString();
	},
	setCompareEnd: function(time) {
		this.setTime(time, 3);
	},
	getCompareEnd: function() {
		return this.model.get('compareEnd');
	},
	getCompareEndString: function() {
		return this.model.compareEndString();
	},
	setEnableCompare: function(enable) {
		this.model.set({enableCompare: enable});
	},
	getEnableCompare: function() {
		return this.model.get('enableCompare');
	},
	setUnit: function(unit) {
		this.model.set({unit: unit});
	},
	getUnit: function() {
		return this.model.get('unit');
	},
	setTime: function(time, index) {
		var autoIndex = !this.model.get('enableCompare'),
			start = null,
			end = null;
			
		if(index !== undefined) {
			autoIndex = false;
			this.model.set({'timeIndex': index}, {'silent': true});
		} else {
			index = this.model.get('timeIndex');
		}
		
		if(autoIndex || index < 2) {
			start = this.getStart();
			if(!start || index == 0) {
				start = time;
				end = time;
			} else {
				if(time - start < 0) {
					end = start;
					start = time;
				} else {
					end = time;
				}
			}
			this.model.set({start: start, end: end});
		} else {
			start = this.getCompareStart();
			if(!start || index == 2) {
				start = time;
				end = time;
			} else {
				if(time - start < 0) {
					end = start;
					start = time;
				} else {
					end = time;
				}
			}
			this.model.set({compareStart: start, compareEnd: end});
		}
		
		this.nextTimeIndex();
	},
	nextTimeIndex: function() {
		var index = this.model.get('timeIndex'),
			timeName = this.model.get('timeName'),
			enableCompare = this.model.get('enableCompare'),
			max = enableCompare ? 3 : 1;
		if(index < max) {
			index++;
		} else {
			index = 0;
		}
		this.setTimeIndex(index);
		return index;
	},
	setTimeIndex: function(index) {
		this.model.set({timeIndex: index});
		this.focusInput('.' + DATE_INPUT_CLASS_NAME[index]);
	}
});

var ViewModel = Backbone.Model.extend({
	defaults: {
		odp: null,
		parent: null,
		range: RANGE_CUSTOM,
		start: null,
		end: null,
		enableCompare: false,
		compareStart: null,
		compareEnd: null,
		unit: UNIT_AUTO,
		clearFloat: null,
		needUpdate: true,
		locale: null
	},
	validate: function(attrs) {
		for (var name in attrs) {
			if(name == 'start' && this.isIllegalTime(attrs.start)) {
				return 'start is illegal.';
			}
			if(name == 'end' && this.isIllegalTime(attrs.end)) {
				return 'end is illegal.';
			}
			if(name == 'enableCompare' && this.isBlank(attrs.enableCompare)) {
				return 'enableCompare is illegal.';
			}
			if(name == 'compareStart' && this.isIllegalTime(attrs.compareStart)) {
				return 'compareStart is illegal.';
			}
			if(name == 'compareEnd' && this.isIllegalTime(attrs.compareEnd)) {
				return 'compareEnd is illegal.';
			}
			if(name == 'unit' && this.isBlank(attrs.unit)) {
				return 'unit is illegal.';
			}
		}
	},
	change: function() {
		var start = this.get('start'),
			end = this.get('end'),
			enableCompare = this.get('enableCompare'),
			compareStart = this.get('compareStart'),
			compareEnd = this.get('compareEnd'),
			unit = this.get('unit'),
			diff = 0;
		if(this.hasChanged('start') 
			|| this.hasChanged('end') 
			|| this.hasChanged('enableCompare')
			|| this.hasChanged('compareStart') 
			|| this.hasChanged('compareEnd') 
			|| this.hasChanged('unit')) {
			this.set({needUpdate: true}, {silent: true});
		}
		if(unit == UNIT_AUTO && start && end) {
			diff = (end - start) / (1000 * 60 * 60 * 24);
			if(diff <= 1) {
				unit = UNIT_HOUR;
			} else if(start.getMonth() == end.getMonth()) {
				unit = UNIT_DAY;
			} else if(start.getMonth() != end.getMonth() 
						&& start.getFullYear() == end.getFullYear()) {
				unit = UNIT_MONTH;
			} else if(start.getFullYear() != end.getFullYear()) {
				unit = UNIT_YEAR;
			} else {
				unit = UNIT_DAY;
			}
		}
		var odp = this.get('odp');
		if(odp) {
			odp.start = start;
			odp.end = end;
			odp.enableCompare = enableCompare;
			odp.compareStart = compareStart;
			odp.compareEnd = compareEnd;
			odp.unit = unit;
		}
	},
	startString: function() {
		return this.formatDate(this.get('start'));
	},
	endString: function() {
		return this.formatDate(this.get('end'));
	},
	compareStartString: function() {
		return this.formatDate(this.get('compareStart'));
	},
	compareEndString: function() {
		return this.formatDate(this.get('compareEnd'));
	},
	formatDate: function(date) {
		if(!date) {
			return '';
		}
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		return y + '/' + m + '/' + d;
	},
	isBlank: function(o) {
		return (o === undefined || o == null || String(o).replace(/[\n\r\t]/gi, '') == '');
	},
	isNotBlank: function(o) {
		return !this.isBlank(o);
	},
	isIllegalTime: function(o) {
		return (o === undefined || String(o).replace(/[\n\r\t]/gi, '') == '');
	},
	isLegalTime: function(o) {
		return !this.isIllegalTime(o);
	}
});

var View = Backbone.View.extend({
	tagName: 'div',
	className: 'odp_view',
	events: {
		'click': 'click'
	},
	initialize: function() {
		var odp = this.model.get('odp'),
			parent = this.model.get('parent'),
			clearFloat = null;
		odp.setView(this);
		
		$(this.el).appendTo($(parent));
		clearFloat = $('<div></div>').css('clear', 'both').appendTo($(parent));
		this.model.set({clearFloat: clearFloat});
		this.render();
	},
	render: function() {
		var locale = this.model.get('locale'),
			odp = this.model.get('odp'),
			needUpdate = this.model.get('needUpdate'),
			control = odp.getControl(),
			align = odp.getAlign(),
			startString = this.getStartString(),
			endString = this.getEndString(),
			compareStartString = this.getCompareStartString(),
			compareEndString = this.getCompareEndString(),
			arrowClassName = null,
			compare = null,
			time = null,
			label = null,
			arrow = null,
			row = null,
			table = null;
		
		if(!needUpdate) {
			return;
		}
		this.model.set({needUpdate: false}, {silent: true});
		
		if(compareStartString != '' && compareEndString != '') {
			compare = $('<div></div>').addClass('odp_compare')
									  .append(locale.compareWith)
			  						  .append($('<span></span>').addClass('odp_compare_start')
			  						  							.text(compareStartString))
			  						  .append(' - ')
			  						  .append($('<span></span>').addClass('odp_compare_end')
			  						  							.text(compareEndString));
		}
		
		time = $('<div></div>').addClass('odp_label')
							   .append($('<span></span>').addClass('odp_start')
														 .text(startString))
							   .append(' - ')
							   .append($('<span></span>').addClass('odp_end')
														 .text(endString));
		var label = $('<td></td>').append(time)
								  .append(compare);
		
		
		arrow = $('<td></td>').addClass('odp_view_arrow')
							  .append($('<div></div>').addClass('odp_view_arrow_down'));
						
		row = $('<tr></tr>').append(label);
		if(align == ALIGN_LEFT) {
			arrow.addClass('odp_view_left_arrow');
			row.prepend(arrow);
		} else {
			arrow.addClass('odp_view_right_arrow');
			row.append(arrow);
		}
		
		table = $('<table></table>').addClass('odp_view_table')
									.append(row);
		$(this.el).empty().append(table);
		if(control) {
			control.adjustPosition();
		}
		odp.change();
	},
	click: function(event) {
		event.stopImmediatePropagation();
		var arrow = $('.odp_view_arrow'),
			show = arrow.find('.odp_view_arrow_up').size() > 0,
			odp = this.model.get('odp'),
			control = odp.getControl();
		if(show) {
			control.hide();
			arrow.children().removeClass('odp_view_arrow_up').addClass('odp_view_arrow_down');
		} else {
			control.show();
			arrow.children().removeClass('odp_view_arrow_down').addClass('odp_view_arrow_up');
		}
	},
	top: function(e) {
		if(!e) {
			e = this.el;
		}
		var offset = e.offsetTop;
		if(e.offsetParent != null) {
			offset += this.top(e.offsetParent);
		}
		return offset;
	},
	left: function(e) {
		if(!e) {
			e = this.el;
		}
		var offset = e.offsetLeft;
		if(e.offsetParent != null) {
			offset += this.left(e.offsetParent);
		}
		return offset;
	},
	height: function() {
		return $(this.el).height();
	},
	width: function() {
		return $(this.el).width();
	},
	setRange: function(range) {
		this.model.set({range: range});
	},
	getRange: function() {
		return this.model.get('range');
	},
	setStart: function(time) {
		this.model.set({start: time});
	},
	getStart: function() {
		return this.model.get('start');
	},
	getStartString: function() {
		return this.model.startString();
	},
	setEnd: function(time) {
		this.model.set({end: time});
	},
	getEnd: function() {
		return this.model.get('end');
	},
	getEndString: function() {
		return this.model.endString();
	},
	setCompareStart: function(time) {
		this.model.set({compareStart: time});
	},
	getCompareStart: function() {
		return this.model.get('compareStart');
	},
	getCompareStartString: function() {
		return this.model.compareStartString();
	},
	setCompareEnd: function(time) {
		this.model.set({compareEnd: time});
	},
	getCompareEnd: function() {
		return this.model.get('compareEnd');
	},
	getCompareEndString: function() {
		return this.model.compareEndString();
	},
	setEnableCompare: function(enable) {
		this.model.set({enableCompare: enable});
	},
	getEnableCompare: function() {
		return this.model.get('enableCompare');
	},
	setUnit: function(unit) {
		this.model.set({unit: unit});
	},
	getUnit: function() {
		return this.model.get('unit');
	}
});

var oDatePickerModel = Backbone.Model.extend({
	defaults: {
		align: ALIGN_LEFT,
		parent: null,
		calendars: 2,
		locale: ZHCN,
		startOfWeek: SUNDAY,
		view: null,
		control: null,
		showCompare: true,
		change: null
	}
});

var oDatePicker = Backbone.View.extend({
	start: null,
	end: null,
	enableCompare: false,
	compareStart: null,
	compareEnd: null,
	unit: UNIT_AUTO,
	template: '',
	initialize: function() {
		var align = this.options.align,
			parent = this.options.parent,
			calendars = this.options.calendars,
			locale = this.options.locale,
			startOfWeek = this.options.startOfWeek,
			change = this.options.change,
			showCompare = this.options.showCompare;
			
		if(locale == 'en') {
			locale = EN;
		} else if(locale == 'zhtw' || locale == 'zh-tw') {
			locale = ZHTW;
		} else {
			locale = ZHCN;
		}
			
		this.model = new oDatePickerModel({locale: locale, align: align, parent: parent, calendars: calendars, startOfWeek: startOfWeek, change: change, showCompare: showCompare});
		this.render();
	},
	render: function() {
		var locale = this.model.get('locale'),
			parent = this.model.get('parent'),
			calendars = this.model.get('calendars'),
			startOfWeek = this.model.get('startOfWeek'),
			showCompare = this.model.get('showCompare'),
			start = null,
			end = null;
			
		start = new Date();
		start.setHours(0, 0, 0, 0);
		start.setDate(start.getDate() - 30);
		end = new Date();
		end.setHours(0, 0, 0, 0);
		
		this.start = start;
		this.end = end;
		
		var viewModel = new ViewModel({locale: locale, odp: this, parent: parent, start: start, end: end});
		var view = new View({model: viewModel});
		
		var controlModel = new ControlModel({locale: locale, odp: this, parent: parent, calendars: calendars, startOfWeek: startOfWeek, start: start, end: end, showCompare: showCompare});
		var control = new Control({model: controlModel});
		
		return this;
	},
	change: function() {
		var change = this.model.get('change');
		if(change) {
			change.call(this, this);
		}
	},
	set: function(setting) {
		if(!setting) {
			return;
		}
		var start = setting.start,
			end = setting.end,
			enableCompare = setting.enableCompare,
			compareStart = setting.compareStart,
			compareEnd = setting.compareEnd,
			complete = setting.complete,
			view = this.getView(),
			control = this.getControl();
		if(view) {
			view.setStart(start);
			view.setEnd(end);
			view.setEnableCompare(enableCompare);
			view.setCompareStart(compareStart);
			view.setCompareEnd(compareEnd);
			view.render();
		}
		if(control) {
			control.setStart(start);
			control.setEnd(end);
			control.setEnableCompare(enableCompare);
			control.setCompareStart(compareStart);
			control.setCompareEnd(compareEnd);
			control.updateCalendar();
		}
		if(complete) {
			complete.call(this);
		}
	},
	setControl: function(control) {
		this.model.set({control: control});
	},
	getControl: function() {
		return this.model.get('control');
	},
	setView: function(view) {
		this.model.set({view: view});
	},
	getView: function() {
		return this.model.get('view');
	},
	getAlign: function() {
		return this.model.get('align');
	}
});

win.oDatePicker = oDatePicker;

})(jQuery);