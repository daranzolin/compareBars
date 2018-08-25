#' Function for creating simple comparative bar charts.
#'
#' Simplify comparative bar charts with d3.js: two values, one bar. For each level of an ordinal variable,
#' compareBars compares the two values, and returns the smaller as a uniform color, and the larger
#' remainder as a distinct color.
#'
#' @param data a data frame object in wide form. Must have one string/factor column, and two numeric
#' columns to compare.
#' @param ordinalVar unquoted name of the ordinal variable
#' @param compareVar1 unquoted name of a numeric value to compare
#' @param compareVar2 unquoted name of another numeric value to compare
#' @param width width of the chart in pixels
#' @param height height of the chart in pixels
#' @param orientation if "vertical", the bars will render vertically along the x-axis. If 'horizontal',
#' the bars will render horizontally along the y-axis.
#' @param xLabel optional label for the x-axis
#' @param yLabel optional label for the y-axis
#' @param titleLabel optional label for the title
#' @param subtitleLabel optional label for the subtitle
#' @param compareVarFill1 fill color for one of the levels
#' @param compareVarFill2 fill color for the other level
#' @param minFillColor fill color for the smaller value
#' @param fontFamily font family for the labels
#'
#'@examples
#'\dontrun{
#' library(gapminder)
#' library(tidyverse)
#' gapminder %>%
#'  group_by(continent, year) %>%
#'  summarize(populations = sum(pop)) %>%
#'  spread(continent, populations) %>%
#'  mutate(year = factor(year)) %>%
#'  compareBars(year, Americas, Europe)
#'}
#' @import htmlwidgets
#'
#' @export
compareBars <- function(data,
                          ordinalVar = NULL,
                          compareVar1 = NULL,
                          compareVar2 = NULL,
                          width = NULL,
                          height = NULL,
                          orientation = "vertical",
                          xLabel = "",
                          yLabel = "",
                          titleLabel = "",
                          subtitleLabel = "",
                          compareVarFill1 = "#0072B2",
                          compareVarFill2 = "#E69F00",
                          minFillColor = "#ddd",
                          fontFamily = "sans-serif") {

  if (!inherits(data, "data.frame")) {
    stop("data must be a data frame.", call. = FALSE)
  }

  if (!orientation %in% c("vertical", "horizontal")) {
    stop("orientation must be either 'vertical' or 'horizontal.'", call. = FALSE)
  }

  ov <- rlang::ensym(ordinalVar)
  cv1 <- rlang::ensym(compareVar1)
  cv2 <- rlang::ensym(compareVar2)

  data <- dplyr::select(data, !!!ov, !!!cv1, !!!cv2)

  if (sum(unlist(lapply(data, is.numeric))) != 2 && sum(!unlist(lapply(iris, is.numeric))) != 1) {
    stop("ordinalVar must be a string or factor, and compareVar1 and compareVar2 must be numeric.")
  }

  settings <- list(
    xLabel = xLabel,
    yLabel = yLabel,
    titleLabel = titleLabel,
    subtitleLabel = subtitleLabel,
    compareVarFill1 = compareVarFill1,
    compareVarFill2 = compareVarFill2,
    minFillColor = minFillColor,
    orientation = orientation,
    fontFamily = fontFamily
  )

  x = list(
    data = data,
    settings = settings
  )

  htmlwidgets::createWidget(
    name = 'compareBars',
    x,
    width = width,
    height = height,
    package = 'compareBars',
    sizingPolicy = htmlwidgets::sizingPolicy()
  )
}

#' Shiny bindings for compareBars
#'
#' Output and render functions for using compareBars within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a compareBars
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name compareBars-shiny
#'
#' @export
compareBarsOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'compareBars', width, height, package = 'compareBars')
}

#' @rdname compareBars-shiny
#' @export
renderCompareBars <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, compareBarsOutput, env, quoted = TRUE)
}
