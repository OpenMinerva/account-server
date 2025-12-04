// new DataTable("#user-list", {
// 	info: false,
// 	ordering: false,
// 	paging: true,
// 	pageLength: 2,
// });

$("#kt_datatable_zero_configuration").DataTable({
	columnDefs: [
		{
			targets: 0,
			render: function (data, type, row) {
				return "<button onclick='openDialog(`username`, `" + JSON.stringify(row) + "`)' class='left-align'><span>" + data + "</span></button>";
			},
		},
		{
			targets: 1,
			width: "20%",
		},
		{
			targets: 2,
			width: "10%",
			render: function (data, type, row) {
				return "<button onclick='openDialog(`role`)'><span>" + data + "</span></button>";
			},
		},
		{
			targets: 3,
			width: "20%",
		},
		{
			data: null,
			width: "10%",
			defaultContent: "<button onclick='openDialog(`password`)' ><span>Change</span></button>",
			targets: 4,
		},
		{
			target: 5,
			// visible: false,
			searchable: true,
		},
	],
});

function openDialog(type = "", row) {
	row = JSON.parse(row);
	if (type == "username") {
		document.querySelector("#dialog-username-target").innerText = row[0];
		document.querySelector("#dialog-username-target-id").value = row[5];
		document.querySelector("#username").showModal();
		return;
	}
	if (type == "role") {
		return;
	}
	if (type == "password") {
		return;
	}
}
