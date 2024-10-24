function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.dataTransfer.setData("type", event.target.getAttribute('data-type'));
}

function drop(event, targetId) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedType = event.dataTransfer.getData("type");
    const target = document.getElementById(targetId);
    const targetAccept = target.getAttribute('data-accept');

    if (draggedType === targetAccept) {
        if (!isDuplicate(target, data)) {
            const element = document.getElementById(data);
            const clone = element.cloneNode(true);
            clone.className = "query-item";
            clone.removeAttribute("draggable");
            target.appendChild(clone);
            checkAndGenerateClearButton(targetId);
        } else {
            alert("This item is already in the target area!");
        }
    } else {
        alert("This item cannot be dropped here!");
    }
    target.classList.remove('highlight');
}

function isDuplicate(target, dataId) {
    const existingItems = target.getElementsByClassName('query-item');
    for (let item of existingItems) {
        if (item.id === dataId) {
            return true;
        }
    }
    return false;
}

function clearQuery(builderId) {
    const builder = document.getElementById(builderId);
    while (builder.children.length > 1) {
        builder.removeChild(builder.lastChild);
    }
    const clearBtn = builder.querySelector('.clear-btn');
    if (clearBtn) {
        builder.removeChild(clearBtn);
    }
}

function checkAndGenerateClearButton(builderId) {
    const builder = document.getElementById(builderId);
    if (builder.children.length > 1) {
        let clearBtn = builder.querySelector('.clear-btn');
        if (!clearBtn) {
            clearBtn = document.createElement('div');
            clearBtn.className = 'clear-btn';
            clearBtn.textContent = 'Clear';
            clearBtn.onclick = () => clearQuery(builderId);
            builder.appendChild(clearBtn);
        }
        clearBtn.style.display = 'block';
    } else {
        const clearBtn = builder.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }
}

function highlightArea(event, targetId) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    target.classList.add('highlight');
}

function unhighlightArea(event, targetId) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    target.classList.remove('highlight');
}

document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', drag);
});

document.querySelectorAll('.query-builder-c').forEach(builder => {
    builder.addEventListener('dragover', (event) => {
        allowDrop(event);
        highlightArea(event, builder.id);
    });
    builder.addEventListener('drop', (event) => {
        drop(event, builder.id);
    });
    builder.addEventListener('dragleave', (event) => {
        unhighlightArea(event, builder.id);
    });
});