angular.module('plantCareApp', [])
.controller('MainController', function() {
    const vm = this;
    
    // Registration variables
    vm.isRegistered = false;
    vm.currentUser = null;
    
    // Registration data
    vm.registerData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    
    // Register function
    vm.register = function() {
        // Simple validation
        if (vm.registerData.password !== vm.registerData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Create user
        vm.currentUser = {
            name: vm.registerData.name,
            email: vm.registerData.email
        };
        
        vm.isRegistered = true;
        vm.registerData = { name: '', email: '', password: '', confirmPassword: '' };
    };
    
    // Initialize plants array
    vm.plants = [];
    
    // New plant object
    vm.newPlant = {
        name: "",
        type: "",
        lastWatered: new Date().toISOString().split('T')[0],
        waterFrequency: 7,
        notes: ""
    };
    
    // Available plant types
    vm.plantTypes = ["Succulent", "Fern", "Flowering", "Herb", "Vegetable", "Tree"];
    
    // Search and filter
    vm.searchText = "";
    vm.filterType = "";
    
    // Add a new plant
    vm.addPlant = function() {
        vm.plants.push(angular.copy(vm.newPlant));
        // Reset form
        vm.newPlant = {
            name: "",
            type: "",
            lastWatered: new Date().toISOString().split('T')[0],
            waterFrequency: 7,
            notes: ""
        };
    };
    
    // Water a plant (update last watered date)
    vm.waterPlant = function(plant) {
        plant.lastWatered = new Date().toISOString().split('T')[0];
    };
    
    // Edit a plant
    vm.editPlant = function(plant) {
        // For simplicity, we'll just delete and add to form
        vm.deletePlant(plant);
        vm.newPlant = angular.copy(plant);
    };
    
    // Delete a plant
    vm.deletePlant = function(plant) {
        const index = vm.plants.indexOf(plant);
        if (index !== -1) {
            vm.plants.splice(index, 1);
        }
    };
    
    // Get next watering date
    vm.getNextWateringDate = function(plant) {
        const lastWatered = new Date(plant.lastWatered);
        const nextWatering = new Date(lastWatered);
        nextWatering.setDate(lastWatered.getDate() + parseInt(plant.waterFrequency));
        return nextWatering;
    };
    
    // Get watering status
    vm.getWateringStatus = function(plant) {
        const today = new Date();
        const nextWatering = vm.getNextWateringDate(plant);
        const daysLeft = Math.floor((nextWatering - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
            return "Overdue!";
        } else if (daysLeft === 0) {
            return "Water today!";
        } else if (daysLeft <= 2) {
            return `Water in ${daysLeft} days`;
        } else {
            return "Watering not needed yet";
        }
    };
    
    // Check if watering is urgent
    vm.isWateringUrgent = function(plant) {
        const status = vm.getWateringStatus(plant);
        return status.includes("Overdue") || status.includes("today") || status.includes("1 day");
    };
    
    // Get plants that need watering
    vm.getPlantsNeedingWater = function() {
        return vm.plants.filter(plant => vm.isWateringUrgent(plant));
    };
    
    // Get count of different plant types
    vm.getPlantTypesCount = function() {
        const types = new Set(vm.plants.map(plant => plant.type));
        return types.size;
    };
    
    // Get upcoming watering plants (next 7 days)
    vm.getUpcomingWateringPlants = function() {
        return vm.plants.filter(plant => {
            const nextWatering = vm.getNextWateringDate(plant);
            const today = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(today.getDate() + 7);
            return nextWatering >= today && nextWatering <= sevenDaysFromNow;
        }).sort((a, b) => {
            return vm.getNextWateringDate(a) - vm.getNextWateringDate(b);
        });
    };
    
    // Get color based on plant type
    vm.getPlantColor = function(type) {
        const colors = {
            "Succulent": "#8bc34a",
            "Fern": "#4caf50",
            "Flowering": "#e91e63",
            "Herb": "#ff9800",
            "Vegetable": "#f44336",
            "Tree": "#795548"
        };
        return colors[type] || "#607d8b";
    };
});