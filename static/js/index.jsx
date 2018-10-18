/* This JS is only for being applied to the index.html */

function wobbleTheContainer(event)
{
    let container = event.target;

    container.classList.add('wobble');
    container.classList.add('animated');

    setTimeout(() =>
    {
        container.classList.remove('wobble');
        container.classList.remove('animated');
    }, 1000)
}


document.addEventListener("DOMContentLoaded", function()
{
    document.querySelector('.welcome-container').addEventListener('mouseenter', wobbleTheContainer);
})


 