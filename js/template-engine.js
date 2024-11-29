function renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
        return data[key] || '';
    });
}

function loadPage(pageName, data) {
    fetch('includes/header.html')
        .then(response => response.text())
        .then(header => {
            fetch('includes/footer.html')
                .then(response => response.text())
                .then(footer => {
                    fetch(`${pageName}.html`)
                        .then(response => response.text())
                        .then(content => {
                            const fullPage = header + content + footer;
                            const renderedPage = renderTemplate(fullPage, data);
                            document.body.innerHTML = renderedPage;
                        });
                });
        });
} 