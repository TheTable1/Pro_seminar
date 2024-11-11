import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "./assets/css/country.css";
import "leaflet/dist/leaflet.css";
import Navbar from "./navbar";

function Home() {
  const mapRef = useRef(null); // Use ref to track map instance
  const mapContainerRef = useRef(null); // Ref for the map container (div#map)

  useEffect(() => {
    if (mapRef.current !== null) return; // Prevent re-initializing the map

    const coffeeData = {
      Vietnam: {
        description:
          "Vietnam is the world's largest producer of Robusta coffee.",
      },
      Brazil: {
        description: "Brazil is known for its chocolatey and nutty flavors.",
      },
      Ethiopia: {
        description: "Ethiopian coffee has floral and fruity notes.",
      },
      "United States": {
        description:
          "Although not a major producer, the U.S. has a growing specialty coffee industry.",
      },
      Colombia: {
        description:
          "Colombian coffee is known for its balanced acidity and smooth flavor.",
      },
      Mexico: {
        description: "Mexican coffee has a light body with a nutty flavor.",
      },
      "Costa Rica": {
        description:
          "Costa Rican coffee is known for its bright acidity and full-bodied flavor.",
      },
      Honduras: {
        description: "Honduran coffee has a smooth body with a mild flavor.",
      },
    };

    const map = L.map(mapContainerRef.current).setView([20, 0], 2); // Display world map

    mapRef.current = map; // Store map instance in ref

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    let currentLayer = null; // Store the currently clicked country layer
    let geojson = null; // Store the GeoJSON data for search functionality

    function highlightFeature(e) {
      const layer = e.target;

      // Reset color of previously clicked country (if any)
      if (currentLayer) {
        currentLayer.setStyle({
          weight: 2,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.5,
          fillColor: "#5B4C3B", // Default color when not selected
        });
      }

      // Change color of clicked country
      layer.setStyle({
        weight: 3,
        color: "#ffffff",
        dashArray: "",
        fillOpacity: 0.7,
        fillColor: "#140a01", // Color when selected
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      const countryName = layer.feature.properties.ADMIN;

      if (coffeeData[countryName]) {
        document.getElementById(
          "info"
        ).innerHTML = `<h2>${countryName}</h2><p>${coffeeData[countryName].description}</p>`;
      } else {
        document.getElementById(
          "info"
        ).innerHTML = `<h2>${countryName}</h2><p>No coffee data available</p>`;
      }

      currentLayer = layer;
    }

    function onEachFeature(feature, layer) {
      layer.on({
        click: highlightFeature, // When country is clicked
      });
    }

    // Load GeoJSON data for country boundaries
    fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        geojson = L.geoJson(data, {
          style: {
            fillColor: "#5B4C3B", // Default country color
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.5,
          },
          onEachFeature: onEachFeature,
        }).addTo(map);
      });

    // Search country by name
    function searchCountry() {
      const searchInput = document
        .getElementById("search-input")
        .value.toLowerCase();
      let found = false;

      geojson.eachLayer(function (layer) {
        const countryName = layer.feature.properties.ADMIN.toLowerCase();
        if (countryName === searchInput) {
          found = true;
          map.fitBounds(layer.getBounds()); // Zoom to the searched country
          highlightFeature({ target: layer }); // Highlight the country
        }
      });

      if (!found) {
        alert("Country not found. Please check the name and try again.");
      }
    }

    // Display suggested country names while typing
    function suggestCountries() {
      const searchInput = document
        .getElementById("search-input")
        .value.toLowerCase();
      const suggestionsList = document.getElementById("suggestions");
      suggestionsList.innerHTML = ""; // Clear old suggestions

      if (searchInput === "") {
        suggestionsList.style.display = "none";
        return;
      }

      let suggestions = [];

      geojson.eachLayer(function (layer) {
        const countryName = layer.feature.properties.ADMIN;
        if (countryName.toLowerCase().startsWith(searchInput)) {
          suggestions.push(countryName);
        }
      });

      if (suggestions.length > 0) {
        suggestionsList.style.display = "block";
        suggestions.forEach((country) => {
          const li = document.createElement("li");
          li.textContent = country;
          li.addEventListener("click", () => {
            document.getElementById("search-input").value = country;
            suggestionsList.style.display = "none";
            searchCountry(); // Search immediately when a suggestion is clicked
          });
          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.style.display = "none";
      }
    }

    // Add search functionality to the search button
    document
      .getElementById("search-button")
      .addEventListener("click", searchCountry);

    // Add suggestions functionality when typing
    document
      .getElementById("search-input")
      .addEventListener("input", suggestCountries);

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run this effect once when the component mounts

  return (
    <div>
      <Navbar />
      <div ref={mapContainerRef} id="map" style={{ height: "500px" }}></div>
      <div id="info"></div>

      <div id="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search for a country..."
        />
        <ul id="suggestions"></ul>
        <button id="search-button">Search</button>
      </div>
    </div>
  );
}

export default Home;
