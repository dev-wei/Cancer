'use strict';
module.exports = function (ngModule) {
  var _ = require('lodash');
  var d3 = require('d3');
  var moment = require('moment');

  ngModule.directive('stockTrendChart', function($window, $interval, $log) {
    var TYPE = {
      BASIC: 0,
      SPARK_LINE: 1
    };
    var MIN_WIDTH = 150;
    var MIN_HEIGHT = 300;
    var MARGIN = {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    };
    var MARGIN2 = {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    };

    function StockTrendChart(element, chartType) {
      function getWidth(margin) {
        var graph = Math.max(MIN_WIDTH, element.width() - margin.left - margin.right);
        return {
          graph: graph,
          svg: graph + margin.left + margin.right
        };
      }

      function getHeight(margin) {
        var graph = Math.max(MIN_HEIGHT, element.height() - margin.top - margin.bottom);
        return {
          graph: graph,
          svg: graph + margin.top + margin.bottom
        };
      }

      function Trends() {
        function getSymbols(data) {
          return _.flatten(data, 'name');
        }

        function getAllSamples(data) {
          return _.flatten(data, 'data');
        }

        function ticks(samples) {
          return Math.max(samples / TICKS_DENSITY, 2);
        }

        var self = this;
        var TICKS_DENSITY = 50;

        /** Axises **/
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        /** Colors **/
        var color = d3.scale.category20();

        /** Lines **/
        var line = d3.svg.line()
          .interpolate('linear')
          .x(function(d) {
            return xScale(d.date);
          })
          .y(function(d) {
            return yScale(d.close);
          });

        self.xScale = function(value) {
          if (!arguments.length) {
            return xScale;
          }
          xScale = value;
          return self;
        };

        self.yScale = function(value) {
          if (!arguments.length) {
            return yScale;
          }
          yScale = value;
          return self;
        };

        /** Update **/
        self.update = function(selection) {
          selection.each(function(data) {
            graph.selectAll(".x.axis").remove();
            graph.selectAll(".y.axis").remove();
            graph.selectAll(".series").remove();

            color.domain(getSymbols(data));

            var allSamples = getAllSamples(data);
            xScale.domain(d3.extent(allSamples, function(d) {
              return d.date;
            }));
            yScale.domain(d3.extent(allSamples, function(d) {
              return d.close;
            }));

            xAxis.ticks(d3.time.minutes, 15);

            graph
              .append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height.graph + ')')
              .call(xAxis);

            graph.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Price ($)');

            graph.selectAll('.series')
              .data(data)
              .enter()
              .append('g')
              .classed('series', true)
              .append('path')
              .attr('class', 'line')
              .attr('d', function(d) {
                return line(d.data);
              })
              .style('stroke', function(d) {
                return color(d.name);
              });
          });
        };

        /** Resize **/
        self.resize = function(selection) {
          selection.each(function(data) {
            xScale.range([0, width.graph]);
            yScale.range([height.graph, 0]);

            xAxis.ticks(ticks(width.graph));
            yAxis.ticks(ticks(height.graph));

            svg
              .attr('width', width.svg)
              .attr('height', height.svg);

            graph.select('.x.axis')
              .attr('transform', 'translate(0,' + height.graph + ')')
              .call(xAxis);

            graph.select('.y.axis')
              .call(yAxis);

            graph.selectAll('.series .line')
              .attr('d', function(d) {
                return line(d.data);
              });
          });
        };
      }

      function GridLines() {
        var self = this;
        var xScale = d3.time.scale();
        var yScale = d3.scale.linear();
        var xTicks = 10;
        var yTicks = 10;

        var xLines = function(data, grid) {
          var xlines = grid.selectAll('.x')
            .data(data);
          xlines
            .enter().append('line')
            .attr({
              'class': 'x',
              'x1': function(d) {
                return xScale(d);
              },
              'x2': function(d) {
                return xScale(d);
              },
              'y1': yScale.range()[0],
              'y2': yScale.range()[1]
            });
          xlines
            .attr({
              'x1': function(d) {
                return xScale(d);
              },
              'x2': function(d) {
                return xScale(d);
              },
              'y1': yScale.range()[0],
              'y2': yScale.range()[1]
            });
          xlines.exit().remove();
        };

        var yLines = function(data, grid) {
          var ylines = grid.selectAll('.y')
            .data(data);
          ylines
            .enter().append('line')
            .attr({
              'class': 'y',
              'x1': xScale.range()[0],
              'x2': xScale.range()[1],
              'y1': function(d) {
                return yScale(d);
              },
              'y2': function(d) {
                return yScale(d);
              }
            });
          ylines
            .attr({
              'x1': xScale.range()[0],
              'x2': xScale.range()[1],
              'y1': function(d) {
                return yScale(d);
              },
              'y2': function(d) {
                return yScale(d);
              }
            });
          ylines.exit().remove();
        };

        self.xScale = function(value) {
          if (!arguments.length) {
            return xScale;
          }
          xScale = value;
          return self;
        };

        self.yScale = function(value) {
          if (!arguments.length) {
            return yScale;
          }
          yScale = value;
          return self;
        };

        self.xTicks = function(value) {
          if (!arguments.length) {
            return xTicks;
          }
          xTicks = value;
          return self;
        };

        self.yTicks = function(value) {
          if (!arguments.length) {
            return yTicks;
          }
          yTicks = value;
          return self;
        };

        self.update = function(selection) {
          selection.each(function() {
            var xTickData = xScale.ticks(xTicks);
            var yTickData = yScale.ticks(yTicks);
            var grid = d3.select(this).selectAll('.gridlines').data([
              [xTickData, yTickData]
            ]);
            grid.enter().append('g').classed('gridlines', true);
            xLines(xTickData, grid);
            yLines(yTickData, grid);
          });
        };

        self.resize = function(selection) {
          selection.each(function() {
            var xTickData = xScale.ticks(xTicks);
            var yTickData = yScale.ticks(yTicks);
            var grid = d3.select(this).selectAll('.gridlines').data([
              [xTickData, yTickData]
            ]);
            grid.enter().append('g').classed('gridlines', true);
            xLines(xTickData, grid);
            yLines(yTickData, grid);
          });
        };
      }

      /** Type **/
      var type = chartType;

      /** Measurement **/
      var width = getWidth(MARGIN);
      var height = getHeight(MARGIN);

      /** Svg **/
      var svg = d3.select(element.context)
        .append('svg')
        .attr('width', width.svg)
        .attr('height', height.svg);

      /** Graph **/
      var graph = svg
        .append('g')
        .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

      /** Scales **/
      var xScale = d3.time.scale()
        .range([0, width.graph])
        .nice(d3.time.hour);
      var yScale = d3.scale.linear()
        .range([height.graph, 0])
        .nice();

      var trends = new Trends();
      var gridLines = new GridLines()
        .xScale(xScale)
        .yScale(yScale)
        .xTicks(10)
        .yTicks(5);

      this.update = function(data) {
        graph.datum(data).call(trends.update);
        graph.call(gridLines.update);
      };

      this.resize = function(data) {
        width = getWidth(MARGIN);
        height = getHeight(MARGIN);

        graph.datum(data).call(trends.resize);
        graph.call(gridLines.resize);
      };
    }

    return {
      restrict: 'C',
      scope: {
        data: '='
      },
      link: function($scope, elem) {
        var chart = new StockTrendChart(elem, TYPE.BASIC);
        var data;

        var window = angular.element($window);
        window.on('resize', function(event) {
          $scope.$apply(function() {
            chart.resize(data);
          });
        });

        var simulateDataPulse = function() {
          var DURATION = 3600;
          var start = moment().subtract(DURATION, 'seconds');

          function createSeries(ticks, base) {
            var slice = Math.ceil(DURATION / ticks);
            return _(ticks).range().map(function(i) {
              return {
                open: (base + _.random(-base / 5, base / 5)).toFixed(2),
                high: (base + _.random(-base / 5, base / 5)).toFixed(2),
                low: (base + _.random(-base / 5, base / 5)).toFixed(2),
                close: (base + _.random(-base / 5, base / 5)).toFixed(2),
                date: moment(start).add(slice * (i + 1), 'seconds').toDate()
              };
            }).value();
          }

          function createNext(ticks, base, last) {
            var slice = Math.ceil(DURATION / ticks);
            return {
              open: (base + _.random(-base / 5, base / 5)).toFixed(2),
              high: (base + _.random(-base / 5, base / 5)).toFixed(2),
              low: (base + _.random(-base / 5, base / 5)).toFixed(2),
              close: (base + _.random(-base / 5, base / 5)).toFixed(2),
              date: moment(last.date).add(slice, 'seconds').toDate()
            };
          }

          (function() {
            var metas = [{
              name: 'MSFT',
              ticks: 5,
              base: 40
            }, {
              name: 'APPL',
              ticks: 5,
              base: 60
            }, {
              name: 'FB',
              ticks: 5,
              base: 50
            }];

            data = [];
            metas.forEach(function(meta) {
              data.push({
                name: meta.name,
                data: createSeries(meta.ticks, meta.base)
              });
            });

            chart.update(data);

            var count = 0;
            var stop = $interval(function() {
              var key = count++ % 3;
              data[key].data.push(createNext(60, metas[key].base, _.last(data[key].data)));

              chart.update(data);

              //$interval.cancel(stop);
            }, 1000);
          }());
        };

        simulateDataPulse();
      }
    };
  });
};
