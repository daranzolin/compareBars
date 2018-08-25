#' compareBars
#'
#' Simplify comparative bar charts with d3.js.
#'
#' @import htmlwidgets
#'
#' @export
compareBars <- function(data,
                          ordinalVar = NULL,
                          compareVar1 = NULL,
                          compareVar2 = NULL,
                          width = 800,
                          height = 500,
                          orientation = "vertical",
                          xLabel = "",
                          yLabel = "",
                          titleLabel = "",
                          subtitleLabel = "",
                          compareVarFill1 = "#0072B2",
                          compareVarFill2 = "#E69F00",
                          minFillColor = "#ddd") {

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
    orientation = orientation
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
    package = 'compareBars'
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
