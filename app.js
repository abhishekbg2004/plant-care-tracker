angular.module('plantCareApp', [])
.controller('MainController', function() {
    const vm = this;
    

    vm.isRegistered = false;
    vm.currentUser = null;
    
   
    vm.registerData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    

    vm.register = function() {
        // Simple validation
        if (vm.registerData.password !== vm.registerData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        vm.currentUser = {
            name: vm.registerData.name,
            email: vm.registerData.email
        };
        
        vm.isRegistered = true;
        vm.registerData = { name: '', email: '', password: '', confirmPassword: '' };
    };
    
    
    vm.plants = [];
    
    vm.newPlant = {
        name: "",
        type: "",
        lastWatered: new Date().toISOString().split('T')[0],
        waterFrequency: 7,
        notes: ""
    };
    
  
    vm.plantTypes = ["Succulent", "Fern", "Flowering", "Herb", "Vegetable", "Tree"];
    
   
    vm.searchText = "";
    vm.filterType = "";
    
    
    vm.addPlant = function() {
        vm.plants.push(angular.copy(vm.newPlant));
    
        vm.newPlant = {
            name: "",
            type: "",
            lastWatered: new Date().toISOString().split('T')[0],
            waterFrequency: 7,
            notes: ""
        };
    };
    
    vm.waterPlant = function(plant) {
        plant.lastWatered = new Date().toISOString().split('T')[0];
    };

    vm.editPlant = function(plant) {
        vm.deletePlant(plant);
        vm.newPlant = angular.copy(plant);
    };
    vm.deletePlant = function(plant) {
        const index = vm.plants.indexOf(plant);
        if (index !== -1) {
            vm.plants.splice(index, 1);
        }
    };
    

    vm.getNextWateringDate = function(plant) {
        const lastWatered = new Date(plant.lastWatered);
        const nextWatering = new Date(lastWatered);
        nextWatering.setDate(lastWatered.getDate() + parseInt(plant.waterFrequency));
        return nextWatering;
    };
    
    
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
    
   
    vm.isWateringUrgent = function(plant) {
        const status = vm.getWateringStatus(plant);
        return status.includes("Overdue") || status.includes("today") || status.includes("1 day");
    };
    
    
    vm.getPlantsNeedingWater = function() {
        return vm.plants.filter(plant => vm.isWateringUrgent(plant));
    };
    

    vm.getPlantTypesCount = function() {
        const types = new Set(vm.plants.map(plant => plant.type));
        return types.size;
    };
    

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
