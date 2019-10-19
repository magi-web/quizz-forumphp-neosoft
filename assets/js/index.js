let sliders = document.querySelectorAll('.slider');
sliders.forEach(function (elem) {
    resetSlider(elem);
    renderSliderValue(elem);
    elem.oninput = function() {renderSliderValue(this)};
});
function resetSlider(elem) {
    if (elem.hasAttribute('data-default')) {
        elem.value = elem.getAttribute('data-default');
    }
}
function renderSliderValue(elem) {
    let valueLabel = elem.value;
    if(elem.hasAttribute('data-maxValueLabel') && parseInt(elem.value) === parseInt(elem.getAttribute('max'))) {
        valueLabel = elem.getAttribute('data-maxValueLabel');
    }
    elem.nextElementSibling.innerHTML = valueLabel;
}
document.forms[0].reset();