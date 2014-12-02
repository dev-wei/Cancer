'use strict';
module.exports = function (ngModule) {
  var _ = require('lodash');
  var d3 = require('d3');
  var moment = require('moment');

  ngModule.directive('stockTrendChart', function ($log, Resizer) {
    var MIN_WIDTH = 150;
    var MIN_HEIGHT = 100;
    var RATIO = 3 / 2;
    var MARGIN = {top: 15, right: 55, bottom: 20, left: 40};
    var MIN_PRICE = 0;
    var MAX_PRICE = 100;
    var LABEL_MARGIN = 6;

    function StockTrendChart(element) {
      var width = Math.max(MIN_WIDTH, element.width() - MARGIN.left - MARGIN.right);
      var height = Math.max(MIN_HEIGHT, Math.floor(element.width() / RATIO) - MARGIN.top - MARGIN.bottom);

      //// resize correct svg element on resize
      //d3.select(element.context).select('svg')
      //    .attr('width', width + MARGIN.left + MARGIN.right)
      //    .attr('height', height + MARGIN.top + MARGIN.bottom);
      var svg = d3.select(element.context).append('svg')
          .attr('width', width + MARGIN.left + MARGIN.right)
          .attr('height', height + MARGIN.top + MARGIN.bottom)
          .append('g')
          .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

      var xScale = d3.time.scale().range([0, width]).nice(d3.time.day);
      var yScale = d3.scale.linear().range([height, 0]).nice();

      var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
      var yAxis = d3.svg.axis().scale(yScale).orient("left");

      var line = d3.svg.line()
          .x(function (d) {
            return xScale(d.date);
          })
          .y(function (d) {
            return yScale(d.close);
          });

      this.update = function (data) {

        xScale.domain(d3.extent(data, function (d) {
          return d.date;
        }));
        yScale.domain(d3.extent(data, function (d) {
          return d.close;
        }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

        var dataPerPixel = data.length/width;
        var dataResampled = data.filter(
            function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
        );

        svg.append("path")
            .datum(dataResampled)
            .attr("class", "line")
            .attr("d", line);

        var firstRecord = data[data.length-1],
            lastRecord = data[0];

        var first = svg.append("g")
            .attr("class", "first")
            .style("display", "none");

        first.append("text")
            .attr("x", -8)
            .attr("y", 4)
            .attr("text-anchor", "end")
            .text("$" + firstRecord.close);
        first.append("circle")
            .attr("r", 4);

        var last = svg.append("g")
            .attr("class", "last")
            .style("display", "none");

        last.append("text")
            .attr("x", 8)
            .attr("y", 4)
            .text("$" + lastRecord.close);
        last.append("circle")
            .attr("r", 4);
      };

      this.resize = function(){



      };
    }


    return {
      restrict: 'C',
      scope: {
        data: '='
      },
      link: function ($scope, elem) {
        var chart = new StockTrendChart(elem);

        //Resizer.monitor(elem, function () {
        //  //chart.resize();
        //});

        var simulateDataPulse = function () { // jshint ignore: line
          var i = 20;

          function createData(n) {
            return {
              close: 16.1 + i,
              date: moment().add(n, 'day').toDate()
            };
          }

          (function pulseData() {
            var update = _(300).range().map(createData).value();
            chart.update(update);

            i = (i + 1) % 40;
          }());
        };
        simulateDataPulse();
      }
    };
  });
};
