(function () {
    const OUTSIDE_ME_MESSAGE = "I'm glad we are outside.";

    function initOutside() {
        const doormat = document.getElementById("doormat");
        const roomLayer = document.getElementById("room-layer");
        const exit = document.getElementById("exit");
        const outsideLayer = document.getElementById("outside-layer");
        const meOutside = document.getElementById("me-outside");

        function goOutside() {
            roomLayer.style.display = "none";
            outsideLayer.style.display = "block";
        }

        function goRoom() {
            roomLayer.style.display = "block";
            outsideLayer.style.display = "none";
        }

        doormat.addEventListener("click", goOutside);
        exit.addEventListener("click", goRoom);

        if (meOutside && window.Helpers && window.Helpers.Dialog) {
            meOutside.addEventListener("click", function () {
                window.Helpers.Dialog.show("Summer", OUTSIDE_ME_MESSAGE);
            });
        }
    }

    initOutside();
})();