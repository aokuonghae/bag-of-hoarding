async function renderEquipment() {
    const equipment = await loadEquipment();
    const tbody = document.getElementById('equipment-list');
    const table = document.getElementById('equipment-table');
    const totalSection = document.getElementById('total-section');
    
    equipment.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="price">${formatCurrency(item.cost)}</td>
            <td class="weight">${item.weight || '—'}</td>
            <td>
                <input type="number" 
                       id="qty-${item.id}" 
                       class="qty-input" 
                       min="0" 
                       value="0" 
                       step="1">
            </td>
        `;
        tbody.appendChild(row);
    });
    
    table.style.display = 'table';
    totalSection.style.display = 'block';
    initializeListeners();
}

document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading-message');
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = 'Accumulating treasure since your last long rest...';
    }

    await renderEquipment();
    
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
});