(function () {
    function initOutside() {
        const doormat = document.getElementById("doormat");
        const roomLayer = document.getElementById("room-layer");
        const exit = document.getElementById("exit")
        const outsideLayer = document.getElementById("outside-layer");

        function goOutside(){
            roomLayer.style.display = "none";
            outsideLayer.style.display = "block";
        }

        function goRoom(){
            roomLayer.style.display = "block";
            outsideLayer.style.display = "none";
        }

        doormat.addEventListener("click", goOutside);
        exit.addEventListener("click", goRoom);
    }

        initOutside();

    
})();