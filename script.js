// Data awal default
let items = [
  { desc: "Ocean Freight Shanghai to Jakarta", qty: "1 Cont", price: 24500000 },
  { desc: "Terminal Handling Charge (THC)", qty: "1 Cont", price: 2100000 },
  { desc: "Customs Clearance Service", qty: "1 Shipment", price: 3500000 },
  { desc: "Documentation & B/L Fee", qty: "1 Doc", price: 7500000 }
];

// Inisialisasi saat pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
  renderInputItems();
  updateQuotation();

  // Pasang listener pada semua input teks biasa
  document.querySelectorAll("#quotationForm input").forEach(input => {
    input.addEventListener("input", updateQuotation);
  });
});

// Render Form Input Baris Biaya di ERP Panel
function renderInputItems() {
  const itemListTbody = document.getElementById("itemList");
  itemListTbody.innerHTML = "";

  items.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${item.desc}" oninput="updateItem(${index}, 'desc', this.value)"></td>
      <td><input type="text" value="${item.qty}" oninput="updateItem(${index}, 'qty', this.value)"></td>
      <td><input type="number" value="${item.price}" oninput="updateItem(${index}, 'price', this.value)"></td>
      <td><button type="button" class="btn-remove" onclick="removeItemRow(${index})">×</button></td>
    `;
    itemListTbody.appendChild(tr);
  });
}

// Tambah baris baru
function addItemRow() {
  items.push({ desc: "Layanan Baru", qty: "1", price: 0 });
  renderInputItems();
  updateQuotation();
}

// Hapus baris
function removeItemRow(index) {
  items.splice(index, 1);
  renderInputItems();
  updateQuotation();
}

// Update data item dari input
function updateItem(index, key, value) {
  items[index][key] = key === 'price' ? parseFloat(value) || 0 : value;
  updateQuotation();
}

// Format Angka ke Rupiah
function formatIDR(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

// Sinkronisasi data dari Form ERP ke Template Preview
function updateQuotation() {
  // 1. Text Fields
  document.getElementById("outNoQuo").innerText = document.getElementById("inputNoQuo").value;
  document.getElementById("outCustomer").innerText = document.getElementById("inputCustomer").value;
  document.getElementById("outCustomerSig").innerText = document.getElementById("inputCustomer").value;
  document.getElementById("outAttn").innerText = document.getElementById("inputAttn").value;
  document.getElementById("outEmail").innerText = document.getElementById("inputEmail").value;
  document.getElementById("outDate").innerText = document.getElementById("inputDate").value;
  document.getElementById("outValidDate").innerText = document.getElementById("inputValidDate").value;
  
  document.getElementById("outService").innerText = document.getElementById("inputService").value;
  document.getElementById("outIncoterm").innerText = document.getElementById("inputIncoterm").value;
  document.getElementById("outPOL").innerText = document.getElementById("inputPOL").value;
  document.getElementById("outPOD").innerText = document.getElementById("inputPOD").value;
  document.getElementById("outCommodity").innerText = document.getElementById("inputCommodity").value;
  document.getElementById("outWeightVol").innerText = document.getElementById("inputWeightVol").value;
  
  document.getElementById("outSales").innerText = document.getElementById("inputSales").value;
  document.getElementById("outSalesSig").innerText = document.getElementById("inputSales").value;

  // 2. Table & Calculation
  const outCostTable = document.getElementById("outCostTable");
  outCostTable.innerHTML = "";
  
  let subtotal = 0;

  items.forEach((item, idx) => {
    const totalItem = item.price; // Dalam contoh ini Qty berupa string deskriptif (misal 1 Cont)
    subtotal += totalItem;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${item.desc}</td>
      <td class="text-center">${item.qty}</td>
      <td class="text-right">${formatIDR(item.price)}</td>
      <td class="text-right">${formatIDR(totalItem)}</td>
    `;
    outCostTable.appendChild(tr);
  });

  // Calculation Taxes
  const ppnRate = parseFloat(document.getElementById("inputPPN").value) || 0;
  const ppnAmount = subtotal * (ppnRate / 100);
  const grandTotal = subtotal + ppnAmount;

  document.getElementById("outSubtotal").innerText = formatIDR(subtotal);
  document.getElementById("outPPNRate").innerText = ppnRate;
  document.getElementById("outPPNAmount").innerText = formatIDR(ppnAmount);
  document.getElementById("outGrandTotal").innerText = formatIDR(grandTotal);
}