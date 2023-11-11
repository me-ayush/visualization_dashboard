$(document).ready(function () {
    let data;
    // Toggle sidebar
    $("#toggleFiltersBtn").click(function () {
        //     $("#toggleFiltersBtn").text(function (index, text) {
        //         return text.trim() === "Show Filters" ? "X" : "Show Filters";
        //     });

        // Toggle the hamburger icon and cross icon
        $(".hamburger-icon").toggleClass("hidden");
        $(".cross-icon").toggleClass("hidden");


        $(".sidebar").toggleClass("show");
        $(".main-content").toggleClass("expanded");
        $("#toggleFiltersBtn").toggleClass("expanded");
    });

    $("#applyFiltersBtn").click(function () {
        var endYear = $('#endYearFilter').val();
        var startYear = $('#startYearFilter').val();
        var topics = $('#topicsFilter').val();
        var sector = $('#sectorFilter').val();
        var region = $('#regionFilter').val();
        var pest = $('#pestFilter').val();
        var source = $('#sourceFilter').val();
        var country = $('#countryFilter').val();

        var filteredData = data.filter(function (item) {
            return (endYear === 'all' || item.end_year === endYear) &&
                (startYear === 'all' || item.start_year === startYear) &&
                (topics === 'all' || item.topic === topics) &&
                (sector === 'all' || item.sector === sector) &&
                (region === 'all' || item.region === region) &&
                (pest === 'all' || item.pestle === pest) &&
                (source === 'all' || item.source === source) &&
                (country === 'all' || item.country === country);
        });
        showData(filteredData)
    });


    $('#resetFiltersBtn').on('click', function () {
        $('#endYearFilter, #startYearFilter, #topicsFilter, #sectorFilter, #regionFilter, #pestFilter, #sourceFilter, #countryFilter').val('all');
        showData(data)
    });

    // AJAX call to fetch data
    $.ajax({
        url: "http://localhost:8000/data/", // Replace with your actual URL
        method: "GET",
        dataType: "json",
        success: function (dataFromViews) {
            // Extract data from the response
            data = dataFromViews.data;
            showData(data);
        },
        error: function (error) {
            console.error("Error fetching data:", error);
        },
    });

    function showData(data) {
        var intensityData = data.reduce((acc, item) => {
            var existingItem = acc.find((entry) => entry.x === item.sector);
            if (existingItem) {
                existingItem.y += item.intensity;
            } else {
                acc.push({ x: item.sector, y: item.intensity });
            }
            return acc;
        }, []);

        // Create a bar chart
        createBarChart(
            "intensityChart",
            "Intensity Distribution",
            "Intensity",
            intensityData
        );
        createBarChart(
            "likelihoodChart",
            "Likelihood Distribution",
            "Intensity",
            intensityData
        );

    }

    function createBarChart(chartId, chartTitle, label, data) {
        var ctx = document.getElementById(chartId);

        // Check if a chart instance already exists
        if (ctx.chart) {
            // Destroy the existing chart instance
            ctx.chart.destroy();
        }

        // Create a new chart instance
        ctx.chart = new Chart(ctx.getContext("2d"), {
            type: "bar",
            data: {
                labels: data.map((item) => (item.x != "" ? item.x : "No Sector")),
                datasets: [
                    {
                        label: label,
                        data: data.map((item) => item.y),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (tooltipItems) {
                                return chartTitle;
                            },
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                            },
                            footer: function (tooltipItems) {
                                var filters = getAppliedFilters();
                                return filters.join('\n');
                            },
                        },
                    },
                },
            },
        });
    }

    function getAppliedFilters() {
        var appliedFilters = [];
        var filterIds = [
            'endYearFilter',
            'startYearFilter',
            'topicsFilter',
            'sectorFilter',
            'regionFilter',
            'pestFilter',
            'sourceFilter',
            'countryFilter'
        ];

        filterIds.forEach(function (filterId) {
            var filterValue = $('#' + filterId).val();
            if (filterValue !== 'all') {
                appliedFilters.push(`${filterId.replace('Filter', '')}: ${filterValue}`);
            }
        });

        return appliedFilters;
    }

});