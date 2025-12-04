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
				return "<button onclick='openDialog(`role`, `" + JSON.stringify(row) + "`)'><span>" + data + "</span></button>";
			},
		},
		{
			targets: 3,
			width: "20%",
		},
		{
			data: null,
			width: "10%",
			render: function (data, type, row) {
				return "<button onclick='openDialog(`password`, `" + JSON.stringify(row) + "`)'><span>Change</span></button>";
			},
			targets: 4,
		},
		{
			target: 5,
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
		document.querySelector("#dialog-role-target").innerText = row[0];
		document.querySelector("#dialog-role-target-id").value = row[5];
		// Find the current role of the user, and select that in the drop down
		const roleString = row[2];
		const targetElement = document.querySelector(`#role select [value='${roleString}']`) || document.querySelector(`#role select [value=user]`);
		targetElement.selected = true;

		document.querySelector("#role").showModal();
		return;
	}
	if (type == "password") {
		document.querySelector("#dialog-password-target").innerText = row[0];
		document.querySelector("#dialog-password-target-id").value = row[5];
		document.querySelector("#password").showModal();
		return;
	}
}
