using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Parent_move : MonoBehaviour {
    Rigidbody gameobj;
    public Vector3 _dist;
    // Use this for initialization
    void Start () {
        gameobj = GetComponent<Rigidbody>();
    }
	
	// Update is called once per frame
	void Update () {
        // transform.position = Vector3.Lerp(transform.position, _dist, 2 * Time.deltaTime / Vector3.Distance(transform.position, _dist));
        //transform.position = Vector3.Lerp(transform.position, _dist, 0.001f);
        //Debug.Log(_dist);
    }
}
