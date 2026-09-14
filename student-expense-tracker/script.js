// Get elements

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");

const totalExpense = document.getElementById("totalExpense");
const totalTransactions = document.getElementById("totalTransactions");
const averageExpense = document.getElementById("averageExpense");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");

const editForm = document.getElementById("editForm");


// Load expenses from LocalStorage

let expenses = JSON.parse(localStorage.getItem("studentExpenses")) || [];


// Set today's date automatically

document.getElementById("expenseDate").value =
    new Date().toISOString().split("T")[0];


// Save data to LocalStorage

function saveExpenses() {
    localStorage.setItem(
        "studentExpenses",
        JSON.stringify(expenses)
    );
}


// Add Expense

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title =
        document.getElementById("expenseTitle").value.trim();

    const amount =
        Number(document.getElementById("expenseAmount").value);

    const category =
        document.getElementById("expenseCategory").value;

    const date =
        document.getElementById("expenseDate").value;


    const newExpense = {

        id: Date.now(),

        title: title,

        amount: amount,

        category: category,

        date: date

    };


    expenses.push(newExpense);

    saveExpenses();

    expenseForm.reset();

    document.getElementById("expenseDate").value =
        new Date().toISOString().split("T")[0];

    displayExpenses();

});


// Display Expenses

function displayExpenses() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        filterCategory.value;


    const filteredExpenses = expenses.filter(function (expense) {

        const matchesSearch =
            expense.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });


    expenseList.innerHTML = "";


    if (filteredExpenses.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredExpenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className = "expense-item";


        expenseItem.innerHTML = `

            <div class="expense-info">

                <h3>${escapeHTML(expense.title)}</h3>

                <p>
                    ${escapeHTML(expense.category)}
                    •
                    ${formatDate(expense.date)}
                </p>

            </div>


            <div class="expense-right">

                <div class="amount">
                    ₹${expense.amount.toLocaleString("en-IN")}
                </div>

                <div class="actions">

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>

                </div>

            </div>

        `;


        expenseList.appendChild(expenseItem);

    });


    updateSummary();

}


// Update Summary

function updateSummary() {

    const total = expenses.reduce(
        function (sum, expense) {

            return sum + expense.amount;

        },
        0
    );


    const transactions = expenses.length;


    const average =
        transactions > 0
            ? total / transactions
            : 0;


    totalExpense.textContent =
        `₹${total.toLocaleString("en-IN")}`;

    totalTransactions.textContent =
        transactions;

    averageExpense.textContent =
        `₹${Math.round(average).toLocaleString("en-IN")}`;

}


// Delete Expense

function deleteExpense(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this expense?");


    if (!confirmDelete) {
        return;
    }


    expenses = expenses.filter(function (expense) {

        return expense.id !== id;

    });


    saveExpenses();

    displayExpenses();

}


// Edit Expense

function editExpense(id) {

    const expense =
        expenses.find(function (expense) {

            return expense.id === id;

        });


    if (!expense) {
        return;
    }


    document.getElementById("editId").value =
        expense.id;

    document.getElementById("editTitle").value =
        expense.title;

    document.getElementById("editAmount").value =
        expense.amount;

    document.getElementById("editCategory").value =
        expense.category;

    document.getElementById("editDate").value =
        expense.date;


    editModal.style.display = "block";

}


// Save Edited Expense

editForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const id =
        Number(document.getElementById("editId").value);


    const expense =
        expenses.find(function (expense) {

            return expense.id === id;

        });


    if (!expense) {
        return;
    }


    expense.title =
        document.getElementById("editTitle").value.trim();

    expense.amount =
        Number(document.getElementById("editAmount").value);

    expense.category =
        document.getElementById("editCategory").value;

    expense.date =
        document.getElementById("editDate").value;


    saveExpenses();

    editModal.style.display = "none";

    displayExpenses();

});


// Close Modal

closeModal.addEventListener("click", function () {

    editModal.style.display = "none";

});


// Close modal when clicking outside

window.addEventListener("click", function (event) {

    if (event.target === editModal) {

        editModal.style.display = "none";

    }

});


// Search

searchInput.addEventListener(
    "input",
    displayExpenses
);


// Category Filter

filterCategory.addEventListener(
    "change",
    displayExpenses
);


// Format Date

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// Prevent HTML injection

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Initial Display

displayExpenses();