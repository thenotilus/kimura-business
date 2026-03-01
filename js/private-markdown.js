document.addEventListener('DOMContentLoaded', () => {
    // Navbar Burger
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // Modals
    const modalTriggers = document.querySelectorAll('.js-modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = trigger.dataset.target;
            const $modal = document.getElementById(target);
            $modal.classList.add('is-active');
        });
    });

    const modalCloses = document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const $modal = close.closest('.modal');
            $modal.classList.remove('is-active');
        });
    });

    // Markdown Loading
    const loadMarkdown = async () => {
        const container = document.getElementById('markdown-container');
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '.md');

        try {
            const response = await fetch(`./md/${filename}`);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();

            // Set page title from first H1 if available
            const titleMatch = text.match(/^#\s+(.*)/m);
            if (titleMatch) {
                document.title = titleMatch[1] + ' | Kimura Business Connect';
            }

            container.innerHTML = marked.parse(text);
        } catch (error) {
            console.error('Error loading markdown:', error);
            container.innerHTML = `
                    <div class="notification is-danger">
                        <p>Désolé, impossible de charger le contenu de cette page.</p>
                        <p><a href="../index.html" style="color: white; text-decoration: underline;">Retour à l'accueil</a></p>
                    </div>
                `;
        }
    };

    loadMarkdown();
});