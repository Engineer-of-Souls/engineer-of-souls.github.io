function numbers(vals) {
  var nums = []
  if (vals == null)
    return nums
  for (var i = 0; i < vals.length; i++) {
    if (!isNaN(vals[i]))
      nums.push(+vals[i])
  }
  return nums
}

function nsort(vals) {
  return vals.sort(function numericSort(a, b) { return a - b })
}

function sum(vals) {
  vals = numbers(vals)
  var total = 0
  for (var i = 0; i < vals.length; i++) {
    total += vals[i]
  }
  return total
}

function mean(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN
  return (sum(vals) / vals.length)
}

function median(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN

  var half = (vals.length / 2) | 0

  vals = nsort(vals)
  if (vals.length % 2) {
    // Odd length, true middle element
    return vals[half]
  }
  else {
    // Even length, average middle two elements
    return (vals[half-1] + vals[half]) / 2.0
  }
}
function mode(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN
  var mode = NaN
  var dist = {}
  for (var i = 0; i < vals.length; i++) {
    var value = vals[i]
    var me = dist[value] || 0
    me++
    dist[value] = me
  }
  var rank = numbers(Object.keys(dist).sort(function sortMembers(a, b) { return dist[b] - dist[a] }))
  mode = rank[0]
  return mode
}

function valuesMinusMeanSquared(vals) {
  vals = numbers(vals)
  var avg = mean(vals)
  var diffs = []
  for (var i = 0; i < vals.length; i++) {
    diffs.push(Math.pow((vals[i] - avg), 2))
  }
  return diffs
}

// Population Variance = average squared deviation from mean
function populationVariance(vals) {
  return mean(valuesMinusMeanSquared(vals))
}

// Population Standard Deviation = sqrt of population variance
function populationStdev(vals) {
  return Math.sqrt(populationVariance(vals))
}

function histogram (vals, bins) {
  if (vals == null) {
    return null
  }
  vals = nsort(numbers(vals))
  if (vals.length === 0) {
    return null
  }
  if (bins == null) {
    // pick bins by simple method: Math.sqrt(n)
    bins = Math.sqrt(vals.length)
  }
  bins = Math.round(bins)
  if (bins < 1) {
    bins = 1
  }

  var min = vals[0]
  var max = vals[vals.length - 1]
  if (min === max) {
    // fudge for non-variant data
    min = min - 0.5
    max = max + 0.5
  }

  var range = (max - min)
  // make the bins slightly larger by expanding the range about 10%
  // this helps with dumb floating point stuff
  var binWidth = (range + (range * 0.05)) / bins
  var midpoint = (min + max) / 2
  // even bin count, midpoint makes an edge
  var leftEdge = midpoint - (binWidth * Math.floor(bins / 2))
  if (bins % 2 !== 0) {
    // odd bin count, center middle bin on midpoint
    var leftEdge = (midpoint - (binWidth / 2)) - (binWidth * Math.floor(bins / 2))
  }

  var hist = {
    values: Array(bins).fill(0),
    bins: bins,
    binWidth: binWidth,
    binLimits: [leftEdge, leftEdge + (binWidth * bins)]
  }

  var binIndex = 0
  for (var i = 0; i < vals.length; i++) {
    while (vals[i] > (((binIndex + 1) * binWidth) + leftEdge)) {
      binIndex++
    }
    hist.values[binIndex]++
  }
  return hist;
}

function linearRegression(tpl){
        var lr = {};
        var n = tpl.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < tpl.length; i++) {
          if (isNaN(tpl[i].x) || isNaN(tpl[i].y)) {
            n -= 1;
          } else {
            sum_x += tpl[i].x;
            sum_y += tpl[i].y;
            sum_xy += (tpl[i].x)*(tpl[i].y);
            sum_xx += (tpl[i].x)*(tpl[i].x);
            //sum_yy += (tpl[i].y)*(tpl[i].y);
          }
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        //lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
        return lr;
}