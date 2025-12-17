let equipmentData = [];
let scarcityMultiplier = 1.0;

// Convert gold pieces to gp, sp, cp breakdown
function convertCurrency(goldPieces) {
    const totalCopper = Math.round(goldPieces * 100); // Convert to copper (1 gp = 100 cp)
    
    const gp = Math.floor(totalCopper / 100);
    const sp = Math.floor((totalCopper % 100) / 10);
    const cp = totalCopper % 10;
    
    return { gp, sp, cp };
}

// Format currency for display
function formatCurrency(goldPieces) {
    const { gp, sp, cp } = convertCurrency(goldPieces);
    const parts = [];
    
    if (gp > 0) parts.push(`${gp} gp`);
    if (sp > 0) parts.push(`${sp} sp`);
    if (cp > 0) parts.push(`${cp} cp`);
    
    return parts.length > 0 ? parts.join(', ') : '0 cp';
}

async function loadEquipment() {
    try {
        const response = await fetch('data/adventuring-gear.json');
        const data = await response.json();
        equipmentData = data.adventuring_gear;
        return equipmentData;
    } catch (error) {
        console.error('Failed to load equipment:', error);
        return [];
    }
}

// Calculate total cost and weight from all quantity inputs
function calculateTotal() {
    let totalCost = 0;
    let totalWeight = 0;
    
    equipmentData.forEach(item => {
        const input = document.getElementById(`qty-${item.id}`);
        if (input) {
            const quantity = parseInt(input.value) || 0;
            totalCost += item.cost * scarcityMultiplier * quantity;
            totalWeight += (item.weight || 0) * quantity;
        }
    });
    
    // Update cost display with gp, sp, cp breakdown
    const totalElement = document.getElementById('total-cost');
    if (totalElement) {
        totalElement.textContent = formatCurrency(totalCost);
    }
    
    // Update weight display
    const weightElement = document.getElementById('total-weight');
    if (weightElement) {
        weightElement.textContent = totalWeight.toFixed(1);
    }
    
    return { cost: totalCost, weight: totalWeight };
}

function initializeListeners() {
    equipmentData.forEach(item => {
        const input = document.getElementById(`qty-${item.id}`);
        if (input) {
            input.addEventListener('change', calculateTotal);
            input.addEventListener('input', calculateTotal);  // For real-time updates
        }
    });
    
    // Scarcity multiplier listener
    const multiplierSlider = document.getElementById('scarcity-multiplier');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const resetButton = document.getElementById('reset-multiplier');
    
    if (multiplierSlider && multiplierDisplay) {
        // Initialize from slider value
        scarcityMultiplier = parseFloat(multiplierSlider.value);
        multiplierDisplay.textContent = `${scarcityMultiplier.toFixed(1)}x`;
        
        multiplierSlider.addEventListener('input', (e) => {
            scarcityMultiplier = parseFloat(e.target.value);
            multiplierDisplay.textContent = `${scarcityMultiplier.toFixed(1)}x`;
            updatePriceDisplay();
            calculateTotal();
        });
        
        // Reset button listener
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                multiplierSlider.value = 1.0;
                scarcityMultiplier = 1.0;
                multiplierDisplay.textContent = '1.0x';
                updatePriceDisplay();
                calculateTotal();
            });
        }
    }
}

// Update all displayed prices based on scarcity multiplier
function updatePriceDisplay() {
    equipmentData.forEach(item => {
        const priceCell = document.querySelector(`#qty-${item.id}`).closest('tr').querySelector('.price');
        if (priceCell) {
            priceCell.textContent = formatCurrency(item.cost * scarcityMultiplier);
        }
    });
}