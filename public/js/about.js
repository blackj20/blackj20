document.getElementById('go').addEventListener('click', function() {
    let query = document.getElementById('accrp').value.toLowerCase();
    let sections = document.querySelectorAll('main section');
    sections.forEach(function(section) {
        if (section.textContent.toLowerCase().includes(query)) {
            section.style.background = '#f0f0f0';
        } else {
            section.style.background = 'none';
        }
    });
});